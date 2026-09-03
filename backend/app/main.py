from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine

# Models
from app.models.product import Product
from app.models.order import Order
from app.models.user import User

# Routers
from app.routes.products import router as products_router
from app.routes.orders import router as orders_router
from app.routes.auth import router as auth_router


app = FastAPI(
    title="AI Growth & Agentic Commerce",
    version="1.0.0",
    description="AI-powered growth and agentic commerce platform"
)
app.mount("/static", StaticFiles(directory="static"), name="static")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables
Base.metadata.create_all(bind=engine)


# API Routers
app.include_router(products_router)
app.include_router(orders_router)
app.include_router(auth_router)


@app.get("/")
def home():
    return {
        "status": "OK",
        "project": "AI Growth & Agentic Commerce"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }