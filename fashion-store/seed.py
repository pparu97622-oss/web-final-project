from app import app
from models import db, Product

def run_seed():
    with app.app_context():
        print("🌱 Clearing and Seeding instance/fashion.db...")
        db.drop_all()
        db.create_all()

        items = []
        # Categories and placeholders to reach 48 items
        categories = ["Apparel", "Accessories", "Footwear"]
        
        for cat in categories:
            for i in range(16): # 16 items per category = 48 total
                items.append(Product(
                    name=f"Vogue {cat} Item {i+1}",
                    price=100.0 + (i * 25),
                    category=cat,
                    image=f"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&sig={cat}{i}",
                    desc="High-end luxury item for the Vogue collection.",
                    stock=20
                ))

        db.session.bulk_save_objects(items)
        db.session.commit()
        print(f"✅ 48 Products seeded successfully!")

if __name__ == "__main__":
    run_seed()