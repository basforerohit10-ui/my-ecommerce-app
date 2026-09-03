from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.database import get_db
from app.models.product import Product
from app.services.image_generator import generate_product_image


router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    description: str | None = None


@router.get("/")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()

    return {
        "status": "success",
        "products": products
    }


@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        return {
            "status": "error",
            "message": "Product not found"
        }

    return product


@router.post("/")
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    # Generate AI product image
    image_url = generate_product_image(
        product.name,
        product.category
    )

    new_product = Product(
        name=product.name,
        category=product.category,
        price=product.price,
        description=product.description,
        image_url=image_url
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return {
        "status": "success",
        "message": "Product created successfully",
        "product": new_product
    }