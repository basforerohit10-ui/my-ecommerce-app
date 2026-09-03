from sqlalchemy import Column, Integer, String, Float
from app.database.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String, default="Pending")