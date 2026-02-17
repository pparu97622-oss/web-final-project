import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from models import db, Product, User

app = Flask(__name__, static_folder='.', instance_relative_config=True)
CORS(app)

# Create instance folder if missing
if not os.path.exists(app.instance_path):
    os.makedirs(app.instance_path)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.instance_path, 'fashion.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

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
        return jsonify({"message": "Product saved!", "id": new_p.id})
    
    products = Product.query.all()
    return jsonify([{"id": p.id, "name": p.name, "price": p.price, "image": p.image, "category": p.category, "desc": p.desc, "stock": p.stock} for p in products])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)