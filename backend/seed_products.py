from sqlalchemy import text
from urllib.parse import quote

from app.database.database import SessionLocal
from app.models.product import Product


products = [
    # Electronics
    ("iPhone 15", "Electronics", 59999, "Apple iPhone with advanced camera and powerful performance."),
    ("Samsung Galaxy S24", "Electronics", 74999, "Premium Samsung smartphone with AMOLED display."),
    ("OnePlus 12", "Electronics", 64999, "High-performance smartphone with fast charging."),
    ("Google Pixel 9", "Electronics", 79999, "Google smartphone with AI-powered camera features."),
    ("MacBook Air M3", "Electronics", 99999, "Lightweight Apple laptop powered by M3 chip."),
    ("Dell Inspiron 15", "Electronics", 57999, "Powerful laptop for work and everyday use."),
    ("HP Pavilion", "Electronics", 62999, "Versatile laptop for productivity and entertainment."),
    ("Sony WH-1000XM5", "Electronics", 29999, "Premium wireless noise-cancelling headphones."),
    ("Apple AirPods Pro", "Electronics", 24999, "Wireless earbuds with active noise cancellation."),
    ("Samsung 55 Inch Smart TV", "Electronics", 54999, "4K smart television with modern features."),

    # Fashion
    ("Men Cotton T-Shirt", "Fashion", 499, "Comfortable cotton t-shirt for everyday wear."),
    ("Men Denim Jeans", "Fashion", 1499, "Classic denim jeans with a modern fit."),
    ("Men Formal Shirt", "Fashion", 1299, "Premium formal shirt for office and occasions."),
    ("Women Kurti", "Fashion", 899, "Stylish comfortable kurti for everyday wear."),
    ("Women Saree", "Fashion", 1999, "Elegant saree suitable for special occasions."),
    ("Women Denim Jacket", "Fashion", 2499, "Trendy denim jacket with a modern design."),
    ("Men Sports Jacket", "Fashion", 2999, "Lightweight sports jacket for outdoor activities."),
    ("Leather Wallet", "Fashion", 799, "Premium wallet with multiple card slots."),
    ("Sunglasses", "Fashion", 999, "Stylish UV-protection sunglasses."),
    ("Leather Belt", "Fashion", 699, "Durable leather belt for everyday use."),

    # Shoes
    ("Nike Running Shoes", "Shoes", 4999, "Comfortable running shoes designed for daily workouts."),
    ("Adidas Sports Shoes", "Shoes", 3999, "Lightweight sports shoes for running and training."),
    ("Puma Sneakers", "Shoes", 2999, "Casual sneakers with modern styling."),
    ("Formal Leather Shoes", "Shoes", 2499, "Classic formal shoes for office and events."),
    ("Casual Sneakers", "Shoes", 1799, "Comfortable sneakers for everyday use."),
    ("Women's Running Shoes", "Shoes", 3499, "Lightweight running shoes for women."),
    ("Women's Sandals", "Shoes", 999, "Comfortable sandals with stylish design."),
    ("Men's Slippers", "Shoes", 599, "Soft and comfortable everyday slippers."),

    # Grocery
    ("Basmati Rice 5kg", "Grocery", 699, "Premium long-grain basmati rice."),
    ("Wheat Flour 5kg", "Grocery", 299, "High-quality whole wheat flour."),
    ("Toor Dal 1kg", "Grocery", 169, "Premium quality toor dal."),
    ("Moong Dal 1kg", "Grocery", 149, "Clean and nutritious moong dal."),
    ("Sugar 5kg", "Grocery", 249, "Fine quality refined sugar."),
    ("Sunflower Oil 1L", "Grocery", 149, "Refined sunflower cooking oil."),
    ("Tea 500g", "Grocery", 299, "Premium tea leaves with rich flavor."),
    ("Coffee 200g", "Grocery", 249, "Rich roasted coffee powder."),
    ("Honey 500g", "Grocery", 399, "Natural honey with rich taste."),
    ("Mixed Dry Fruits 500g", "Grocery", 599, "Premium selection of mixed dry fruits."),

    # Home & Kitchen
    ("Non Stick Cookware Set", "Home & Kitchen", 2499, "Complete non-stick cookware set for modern kitchens."),
    ("Mixer Grinder", "Home & Kitchen", 2999, "Powerful mixer grinder for everyday cooking."),
    ("Electric Kettle", "Home & Kitchen", 999, "Fast-boiling electric kettle."),
    ("Air Fryer", "Home & Kitchen", 4999, "Healthy cooking with less oil."),
    ("Dinner Set", "Home & Kitchen", 1999, "Elegant dinner set for family dining."),
    ("Water Bottle", "Home & Kitchen", 499, "Reusable stainless steel water bottle."),
    ("Storage Container Set", "Home & Kitchen", 899, "Airtight containers for kitchen storage."),
    ("Table Lamp", "Home & Kitchen", 799, "Modern decorative table lamp."),
    ("Bedsheet", "Home & Kitchen", 1299, "Soft premium cotton bedsheet."),
    ("Wall Clock", "Home & Kitchen", 699, "Modern wall clock for home decoration."),

    # Beauty
    ("Face Wash", "Beauty", 299, "Gentle daily face wash for clean skin."),
    ("Moisturizer", "Beauty", 399, "Lightweight daily moisturizer."),
    ("Sunscreen SPF 50", "Beauty", 599, "Broad-spectrum sunscreen for daily protection."),
    ("Shampoo", "Beauty", 449, "Daily care shampoo for healthy-looking hair."),
    ("Conditioner", "Beauty", 399, "Moisturizing conditioner for smooth hair."),
    ("Perfume", "Beauty", 1299, "Long-lasting fragrance for everyday use."),
    ("Body Lotion", "Beauty", 349, "Hydrating body lotion."),
    ("Lip Balm", "Beauty", 199, "Moisturizing lip balm for daily care."),

    # Sports
    ("Cricket Bat", "Sports", 2499, "Professional-style cricket bat for players."),
    ("Cricket Ball", "Sports", 499, "Durable cricket ball for practice."),
    ("Football", "Sports", 999, "Durable football for training and matches."),
    ("Badminton Racket", "Sports", 1499, "Lightweight badminton racket."),
    ("Yoga Mat", "Sports", 799, "Non-slip yoga mat for workouts."),
    ("Dumbbell Set", "Sports", 1999, "Adjustable dumbbell set for home workouts."),
    ("Tennis Racket", "Sports", 2499, "Lightweight racket for tennis players."),
    ("Skipping Rope", "Sports", 299, "Adjustable skipping rope for cardio training."),

    # Books
    ("Python Programming Book", "Books", 699, "Beginner-friendly Python programming guide."),
    ("Java Programming Book", "Books", 799, "Complete Java programming fundamentals."),
    ("Data Structures Book", "Books", 899, "Learn important data structures and algorithms."),
    ("Machine Learning Book", "Books", 999, "Introduction to machine learning concepts."),
    ("Web Development Book", "Books", 749, "Learn HTML CSS JavaScript and web development."),
    ("Business Management Book", "Books", 599, "Business and management fundamentals."),

    # Toys
    ("Remote Control Car", "Toys", 1499, "Rechargeable remote control toy car."),
    ("Building Blocks", "Toys", 899, "Creative building blocks for children."),
    ("Toy Robot", "Toys", 1299, "Interactive educational toy robot."),
    ("Puzzle Game", "Toys", 399, "Fun puzzle game for children."),
    ("Teddy Bear", "Toys", 699, "Soft plush teddy bear."),

    # Automotive
    ("Car Phone Holder", "Automotive", 499, "Universal dashboard phone holder."),
    ("Car Cleaning Kit", "Automotive", 799, "Complete car cleaning accessories kit."),
    ("Bike Helmet", "Automotive", 1499, "Protective helmet for motorcycle riders."),
    ("Car Seat Cover", "Automotive", 1999, "Premium car seat cover set."),
    ("Bike Cover", "Automotive", 699, "Water-resistant motorcycle cover."),
    ("Car Air Freshener", "Automotive", 299, "Long-lasting car fragrance."),

    # Accessories
    ("Wireless Mouse", "Accessories", 699, "Ergonomic wireless mouse."),
    ("Mechanical Keyboard", "Accessories", 2499, "Mechanical keyboard for gaming and work."),
    ("USB-C Cable", "Accessories", 399, "Fast charging USB-C cable."),
    ("Power Bank 20000mAh", "Accessories", 1499, "High-capacity portable power bank."),
    ("Laptop Backpack", "Accessories", 1299, "Water-resistant laptop backpack."),
    ("Smart Watch", "Accessories", 2999, "Smartwatch with fitness tracking features."),
]


# --------------------------------------------------
# IMAGE KEYWORDS
# --------------------------------------------------

image_keywords = {
    "iPhone 15": "iphone smartphone",
    "Samsung Galaxy S24": "samsung smartphone",
    "OnePlus 12": "oneplus smartphone",
    "Google Pixel 9": "google pixel smartphone",
    "MacBook Air M3": "macbook laptop",
    "Dell Inspiron 15": "dell laptop",
    "HP Pavilion": "hp laptop",
    "Sony WH-1000XM5": "sony headphones",
    "Apple AirPods Pro": "airpods earbuds",
    "Samsung 55 Inch Smart TV": "smart television",

    "Men Cotton T-Shirt": "men t-shirt",
    "Men Denim Jeans": "men jeans",
    "Men Formal Shirt": "formal shirt",
    "Women Kurti": "women kurti",
    "Women Saree": "saree",
    "Women Denim Jacket": "women denim jacket",
    "Men Sports Jacket": "sports jacket",
    "Leather Wallet": "leather wallet",
    "Sunglasses": "sunglasses",
    "Leather Belt": "leather belt",

    "Nike Running Shoes": "running shoes",
    "Adidas Sports Shoes": "sports shoes",
    "Puma Sneakers": "sneakers",
    "Formal Leather Shoes": "formal leather shoes",
    "Casual Sneakers": "casual sneakers",
    "Women's Running Shoes": "women running shoes",
    "Women's Sandals": "women sandals",
    "Men's Slippers": "slippers",

    "Basmati Rice 5kg": "rice bag",
    "Wheat Flour 5kg": "wheat flour",
    "Toor Dal 1kg": "lentils",
    "Moong Dal 1kg": "moong dal",
    "Sugar 5kg": "sugar bag",
    "Sunflower Oil 1L": "cooking oil",
    "Tea 500g": "tea",
    "Coffee 200g": "coffee",
    "Honey 500g": "honey jar",
    "Mixed Dry Fruits 500g": "dry fruits",

    "Non Stick Cookware Set": "cookware",
    "Mixer Grinder": "mixer grinder",
    "Electric Kettle": "electric kettle",
    "Air Fryer": "air fryer",
    "Dinner Set": "dinner set",
    "Water Bottle": "water bottle",
    "Storage Container Set": "storage containers",
    "Table Lamp": "table lamp",
    "Bedsheet": "bedsheet",
    "Wall Clock": "wall clock",

    "Face Wash": "face wash",
    "Moisturizer": "moisturizer",
    "Sunscreen SPF 50": "sunscreen",
    "Shampoo": "shampoo",
    "Conditioner": "conditioner",
    "Perfume": "perfume",
    "Body Lotion": "body lotion",
    "Lip Balm": "lip balm",

    "Cricket Bat": "cricket bat",
    "Cricket Ball": "cricket ball",
    "Football": "football",
    "Badminton Racket": "badminton racket",
    "Yoga Mat": "yoga mat",
    "Dumbbell Set": "dumbbells",
    "Tennis Racket": "tennis racket",
    "Skipping Rope": "skipping rope",

    "Python Programming Book": "python programming book",
    "Java Programming Book": "java programming book",
    "Data Structures Book": "data structures book",
    "Machine Learning Book": "machine learning book",
    "Web Development Book": "web development book",
    "Business Management Book": "business book",

    "Remote Control Car": "remote control car",
    "Building Blocks": "building blocks toy",
    "Toy Robot": "toy robot",
    "Puzzle Game": "puzzle game",
    "Teddy Bear": "teddy bear",

    "Car Phone Holder": "car phone holder",
    "Car Cleaning Kit": "car cleaning",
    "Bike Helmet": "motorcycle helmet",
    "Car Seat Cover": "car seat cover",
    "Bike Cover": "motorcycle cover",
    "Car Air Freshener": "car air freshener",

    "Wireless Mouse": "wireless mouse",
    "Mechanical Keyboard": "mechanical keyboard",
    "USB-C Cable": "usb c cable",
    "Power Bank 20000mAh": "power bank",
    "Laptop Backpack": "laptop backpack",
    "Smart Watch": "smart watch",
}


# --------------------------------------------------
# DATABASE
# --------------------------------------------------

db = SessionLocal()

try:
    # Make sure image_url column exists
    try:
        db.execute(
            text("ALTER TABLE products ADD COLUMN image_url VARCHAR")
        )
        db.commit()
        print("image_url column added successfully.")

    except Exception:
        db.rollback()
        print("image_url column already exists.")

    # Delete old products
    existing_count = db.query(Product).count()

    print(f"Existing products found: {existing_count}")

    if existing_count > 0:
        print("Deleting old products...")

        db.query(Product).delete()
        db.commit()

        print("Old products deleted successfully.")

    # Add products
    print("Adding products with images...")

    for name, category, price, description in products:

        keyword = image_keywords.get(
            name,
            category
        )

        image_url = (
            "https://loremflickr.com/600/400/"
            + quote(keyword)
        )

        product = Product(
            name=name,
            category=category,
            price=price,
            description=description,
            image_url=image_url
        )

        db.add(product)

    db.commit()

    print(
        f"Successfully added {len(products)} products with images!"
    )

except Exception as error:

    db.rollback()

    print("Error while adding products:")
    print(error)

finally:

    db.close()