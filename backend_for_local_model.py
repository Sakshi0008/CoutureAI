from fastapi import FastAPI, Request
from fastapi.responses import Response
from pydantic import BaseModel
from diffusers.pipelines.stable_diffusion.pipeline_stable_diffusion import StableDiffusionPipeline
import torch
import io
from PIL import Image
import os

app = FastAPI()

MODEL_PATH = os.path.join(os.getcwd(), 'stable_diffusion_model')

class GenerationRequest(BaseModel):
    prompt: str
    fabric: str = ""
    style: str = ""
    occasion: str = ""
    filters: dict = {}

pipe = None

def get_pipe():
    global pipe
    if pipe is None:
        pipe = StableDiffusionPipeline.from_pretrained(MODEL_PATH, torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32)
        if torch.cuda.is_available():
            pipe = pipe.to('cuda')
    return pipe

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
    pipe = get_pipe()
    image = pipe(prompt, num_inference_steps=20, guidance_scale=7.5, width=512, height=512).images[0] # type: ignore
    buf = io.BytesIO()
    # For debugging: save the generated image to disk for checking
    image.save("generated_image_check.png", format="PNG")
    image.save(buf, format='PNG')
    buf.seek(0)
    return Response(content=buf.read(), media_type='image/png') 