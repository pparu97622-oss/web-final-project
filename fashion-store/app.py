import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from models import db, Product, User

app = Flask(__name__, static_folder='.', instance_relative_config=True)
CORS(app)

# --- VERCEL COMPATIBILITY FIX ---
# Detects if running on Vercel to use the writable /tmp directory
if os.environ.get('VERCEL'):
    db_path = '/tmp/fashion.db'
else:
    if not os.path.exists(app.instance_path):
        os.makedirs(app.instance_path)
    db_path = os.path.join(app.instance_path, 'fashion.db')
# --------------------------------

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
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

# --- ADDED: STATIC FILE SUPPORT ---
# This ensures that files like auth.js and style.css are served to the browser
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# Ensures the database tables are created automatically on launch
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)