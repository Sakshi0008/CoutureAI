from fastapi import FastAPI, Request
from fastapi.responses import Response
from pydantic import BaseModel
import io
from PIL import Image
import os
import requests
import base64
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Stability AI API configuration
STABILITY_API_KEY = os.getenv("STABILITY_API_KEY")
# STABILITY_API_KEY = ""

if not STABILITY_API_KEY:
    logger.error("STABILITY_API_KEY environment variable not set!")

class GenerationRequest(BaseModel):
    prompt: str
    fabric: str = ""
    style: str = ""
    occasion: str = ""
    filters: dict = {}

def generate_with_stability(prompt: str):
    url = 'https://api.stability.ai/v2beta/stable-image/generate/sd3'
    logger.info(f"Using API key: {STABILITY_API_KEY}")  
    
    headers = {
        "Authorization": f"Bearer {STABILITY_API_KEY}",
        "Accept": "image/*"
    }
    
    files = {
        "prompt": (None, prompt),
        "output_format": (None, "png"),
    }
    
    response = requests.post(url, headers=headers, files=files)
    
    logger.info(f"API response status: {response.status_code}")
    
    if response.status_code != 200:
        logger.error(f"API error: {response.text}")
        raise Exception(f"Stability API request failed with status {response.status_code}: {response.text}")
    
    # For SD3, the response is the raw image data
    return Image.open(io.BytesIO(response.content))

@app.post('/generate')
async def generate(req: GenerationRequest):
    prompt = req.prompt
    if req.fabric:
        prompt += f", fabric: {req.fabric}"
    if req.style:
        prompt += f", style: {req.style}"
    if req.occasion:
        prompt += f", occasion: {req.occasion}"
    if req.filters:
        if isinstance(req.filters, str):
            import json
            filters = json.loads(req.filters)
        else:
            filters = req.filters
        if filters.get('color'):
            prompt += f", color: {filters['color']}"
        if filters.get('pattern'):
            prompt += f", pattern: {filters['pattern']}"
        if filters.get('texture'):
            prompt += f", texture: {filters['texture']}"
    prompt += ', high quality, detailed, fashion photography, professional lighting'
    
    try:
        logger.info(f"Generating image with prompt: {prompt}")
        image = generate_with_stability(prompt)
        
        # Save to local for debugging
        # save_path = "stability_image_check.png"
        # image.save(save_path, format="PNG")
        # logger.info(f"Image saved to {os.path.abspath(save_path)}")
        
        buf = io.BytesIO()
        image.save(buf, format='PNG')
        buf.seek(0)
        return Response(content=buf.read(), media_type='image/png')
    
    except Exception as e:
        logger.error(f"Generation failed: {str(e)}")
        return {"error": str(e)}, 500