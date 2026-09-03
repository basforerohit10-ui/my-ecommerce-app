import os
from pathlib import Path

from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

token = os.getenv("HF_TOKEN")

if not token:
    raise ValueError("HF_TOKEN is not set in .env")

client = InferenceClient(
    provider="fal-ai",
    api_key=token,
)

IMAGE_DIR = Path("static/product_images")
IMAGE_DIR.mkdir(parents=True, exist_ok=True)


def generate_product_image(product_name: str, category: str) -> str:

    prompt = (
        f"Professional ecommerce product photograph of {product_name}, "
        f"category {category}. "
        f"Show one single product, centered, realistic, "
        f"clean light studio background, soft studio lighting, "
        f"high detail, premium online store photography, "
        f"no text, no logo watermark."
    )

    image = client.text_to_image(
        prompt,
        model="black-forest-labs/FLUX.1-schnell",
    )

    filename = product_name.lower()
    filename = "".join(
        char if char.isalnum() else "_"
        for char in filename
    )
    filename = filename.strip("_") + ".png"

    image_path = IMAGE_DIR / filename

    image.save(image_path)

    return f"/static/product_images/{filename}"