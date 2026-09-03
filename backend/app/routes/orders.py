from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.order import Order


router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


class OrderCreate(BaseModel):
    customer_name: str
    phone: str
    address: str
    total_amount: float


@router.post("/")
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db)
):
    order = Order(
        customer_name=order_data.customer_name,
        phone=order_data.phone,
        address=order_data.address,
        total_amount=order_data.total_amount,
        status="Pending"
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return {
        "status": "success",
        "message": "Order created successfully",
        "order": {
            "id": order.id,
            "customer_name": order.customer_name,
            "phone": order.phone,
            "address": order.address,
            "total_amount": order.total_amount,
            "status": order.status
        }
    }
@router.get("/")
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).all()

    return {
        "status": "success",
        "orders": [
            {
                "id": order.id,
                "customer_name": order.customer_name,
                "phone": order.phone,
                "address": order.address,
                "total_amount": order.total_amount,
                "status": order.status
            }
            for order in orders
        ]
    }