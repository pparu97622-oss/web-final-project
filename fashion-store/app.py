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
    stock = db.Column(db.Integer, default=10) # Added Stock Column

# --- ROUTES ---
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/products', methods=['GET', 'POST'])
def handle_products():
    if request.method == 'POST':
        data = request.json
        new_p = Product(name=data['name'], price=float(data['price']), category=data['category'], image=data['image'], desc=data['desc'], stock=int(data.get('stock', 10)))
        db.session.add(new_p)
        db.session.commit()
        return jsonify({"message": "Success"})
    
    products = Product.query.all()
    return jsonify([{"id": p.id, "name": p.name, "price": p.price, "image": p.image, "category": p.category, "desc": p.desc, "stock": p.stock} for p in products])

@app.route('/api/seed')
def seed():
    db.drop_all()
    db.create_all()
    items = [
        # READY-TO-WEAR
        Product(name="Silk Wrap Blouse", price=320, category="ready-to-wear", image="https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500", desc="100% Organic Silk.", stock=5),
        Product(name="Tailored Wool Coat", price=850, category="ready-to-wear", image="https://images.unsplash.com/photo-1539533377285-b827ee10787d?w=500", desc="Italian Wool.", stock=3),
        Product(name="Velvet Evening Dress", price=1200, category="ready-to-wear", image="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500", desc="Midnight blue velvet.", stock=0),
        Product(name="Cashmere Turtleneck", price=450, category="ready-to-wear", image="https://images.unsplash.com/photo-1576185056943-41710972410a?w=500", desc="Soft cashmere.", stock=10),
        Product(name="Linen Wide Trousers", price=280, category="ready-to-wear", image="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500", desc="Breathable linen.", stock=8),
        Product(name="Satin Slip Skirt", price=190, category="ready-to-wear", image="https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500", desc="Elegant champagne satin.", stock=12),
        # ACCESSORIES
        Product(name="Gold Chain Clutch", price=450, category="accessories", image="https://images.unsplash.com/photo-1566150905458-1bf1fd14dcb1?w=500", desc="Calfskin leather.", stock=4),
        Product(name="Square Sunglasses", price=220, category="accessories", image="https://images.unsplash.com/photo-1511499767390-90342f5b89a7?w=500", desc="UV Protection.", stock=15),
        Product(name="Pearl Drop Earrings", price=180, category="accessories", image="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500", desc="Freshwater pearls.", stock=7),
        Product(name="Leather Belt", price=150, category="accessories", image="https://images.unsplash.com/photo-1624222247344-550fb805831f?w=500", desc="Genuine leather.", stock=0),
        Product(name="Silk Scarf", price=95, category="accessories", image="https://images.unsplash.com/photo-1601924996397-26476ec20eb2?w=500", desc="Hand-rolled edges.", stock=10),
        Product(name="Silver Watch", price=950, category="accessories", image="https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500", desc="Swiss movement.", stock=3),
        # SHOES
        Product(name="Leather Mules", price=580, category="shoes", image="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500", desc="Pointed toe.", stock=6),
        Product(name="Classic Stilettos", price=720, category="shoes", image="https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=500", desc="Suede finish.", stock=5),
        Product(name="Chelsea Boots", price=640, category="shoes", image="https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500", desc="Robust leather.", stock=2),
        Product(name="Strappy Sandals", price=490, category="shoes", image="https://images.unsplash.com/photo-1562273103-918179dd3322?w=500", desc="Summer essentials.", stock=9),
        Product(name="White Sneakers", price=350, category="shoes", image="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500", desc="Minimalist style.", stock=0),
        Product(name="Daily Loafers", price=420, category="shoes", image="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500", desc="Classic daily wear.", stock=11)
    ]
    db.session.bulk_save_objects(items)
    db.session.commit()
    return "18 Products Seeded!"

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)