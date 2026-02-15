from app import app, db, Product

with app.app_context():
    db.create_all()
    # Adding 3 fashion items to start
    items = [
        Product(name="Vintage Denim", price=55.0, image_url="https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"),
        Product(name="Silk Scarf", price=15.0, image_url="https://images.unsplash.com/photo-1601924996397-26476ec20eb2?w=400"),
        Product(name="Woolen Coat", price=110.0, image_url="https://images.unsplash.com/photo-1539533377285-b0bc9567470c?w=400")
    ]
    db.session.add_all(items)
    db.session.commit()
    print("✅ Database seeded successfully!")