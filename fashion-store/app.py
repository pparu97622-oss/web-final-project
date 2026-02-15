import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, static_folder='.')
CORS(app)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'fashion.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- MODELS ---
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    image = db.Column(db.String(500), nullable=False)
    desc = db.Column(db.Text, nullable=True)
    stock = db.Column(db.Integer, default=10)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(100), unique=True)
    name = db.Column(db.String(100))
    role = db.Column(db.String(20), default='user') # Added: 'admin' or 'user'

# --- ROUTES ---
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# UPGRADED: Handle permanent adding and listing
@app.route('/api/products', methods=['GET', 'POST'])
def handle_products():
    if request.method == 'POST':
        data = request.json
        new_p = Product(
            name=data['name'], 
            price=float(data['price']), 
            category=data['category'], 
            image=data['image'], 
            desc=data.get('desc', ''), 
            stock=int(data.get('stock', 10))
        )
        db.session.add(new_p)
        db.session.commit()
        return jsonify({"message": "Product saved permanently!", "id": new_p.id})
    
    products = Product.query.all()
    return jsonify([{"id": p.id, "name": p.name, "price": p.price, "image": p.image, "category": p.category, "desc": p.desc, "stock": p.stock} for p in products])

# NEW: Admin Route to Delete Product
@app.route('/api/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Deleted successfully"})

# NEW: Admin Route to Update/Edit Product (Stock, Price, etc.)
@app.route('/api/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.json
    product.name = data.get('name', product.name)
    product.price = data.get('price', product.price)
    product.stock = data.get('stock', product.stock)
    db.session.commit()
    return jsonify({"message": "Updated successfully"})

@app.route('/api/seed')
def seed():
    db.drop_all()
    db.create_all()
    # ... (Keep your items list here as it was)
    db.session.bulk_save_objects(items)
    db.session.commit()
    return "Database Reset and 18 Products Seeded!"

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)