CoutureAI ✨👗

CoutureAI is a full-stack AI fashion design generator. Describe an outfit, pick a fabric, style and occasion, and CoutureAI generates a fashion image with Stable Diffusion. Designs are saved to your account, can be kept private or shared in a public gallery, and can be liked by other users.

Features
Text-to-fashion generation: write a description and choose fabric, style and occasion to guide the result
Two AI backends: use the Stability AI (SD3) API, or run a Stable Diffusion model locally
Public gallery: browse designs shared by the community and like your favourites
Privacy controls: make any design public or private at any time
Personal dashboard: view your designs, public/private counts and total likes, search, filter, and switch between grid and list views
Authentication: sign up and log in with JWT, with strong password validation
Cloud image storage: generated images are stored on Cloudinary
Tech Stack
Layer	Technologies
Frontend	React 18, TypeScript, Vite, Tailwind CSS, lucide-react, Axios
Backend	Node.js, Express 5, TypeScript (tsx), Mongoose, JWT, bcryptjs, Multer
Database	MongoDB
Image storage	Cloudinary
AI service	Python, FastAPI, Stability AI SD3 API or Hugging Face diffusers (local Stable Diffusion)
Architecture
React + Vite frontend (http://localhost:5173)
        │  Axios
        ▼
Express API (http://localhost:5000)
   ├── MongoDB (users, generated images)
   ├── Cloudinary (image storage)
   └── Python FastAPI service (http://localhost:5001)
         └── POST /generate  →  Stability AI API  or  local Stable Diffusion

When a user generates a design, the Express API forwards the prompt and options to the Python service, uploads the returned image to Cloudinary, and saves the record to MongoDB.

Project Structure
CoutureAI/
├── src/
│   ├── components/        # Hero, Generator, Gallery, Features, Footer, AuthModal, UserDashboard
│   ├── services/api.ts    # Axios client for the backend
│   ├── server/
│   │   ├── server.ts      # Express entry point
│   │   ├── config/        # MongoDB and Cloudinary setup
│   │   ├── middleware/    # JWT auth middleware
│   │   ├── models/        # User and GeneratedImage schemas
│   │   └── routes/        # userRoutes, imageRoutes
│   ├── App.tsx
│   └── main.tsx
├── python_backend.py              # FastAPI service using the Stability AI API
├── backend_for_local_model.py     # FastAPI service using a local Stable Diffusion model
├── scripts/validateModel.js       # Checks the local model files and available RAM
└── package.json
Getting Started
Prerequisites
Node.js 18+
Python 3.9+
A MongoDB database (local or Atlas)
A Cloudinary account
Either a Stability AI API key or a local Stable Diffusion model
1. Clone and install
bash
git clone https://github.com/Sakshi0008/CoutureAI.git
cd CoutureAI
npm install
2. Configure environment variables

Create a .env file in the project root:

env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Only needed for the Stability AI backend
STABILITY_API_KEY=your_stability_api_key
3. Start the AI service (choose one)

Option A: Stability AI API (recommended, no GPU needed)

bash
pip install fastapi uvicorn pillow requests pydantic
uvicorn python_backend:app --port 5001

Option B: Local Stable Diffusion model

Place your model in a stable_diffusion_model/ folder in the project root, then:

bash
pip install fastapi uvicorn pillow pydantic torch diffusers transformers accelerate
npm run validate-model                      # optional: verify the model files
uvicorn backend_for_local_model:app --port 5001

A GPU is strongly recommended. The model is loaded on the first request.

4. Run the app
bash
npm run dev

This starts the Express API on port 5000 and the Vite dev server together. Open the URL printed by Vite (usually http://localhost:5173).

Scripts
Command	Description
npm run dev	Run the API server and the frontend together
npm run server	Run only the Express API
npm run build	Build the frontend for production
npm run preview	Preview the production build
npm run lint	Lint the codebase
npm run validate-model	Validate the local Stable Diffusion model setup
API Reference

Users (/api/users)

Method	Endpoint	Auth	Description
POST	/register	No	Create an account
POST	/login	No	Log in and receive a JWT
GET	/profile	Yes	Get the current user's profile

Images (/api/images)

Method	Endpoint	Auth	Description
POST	/generate	Yes	Generate an image, upload it and save it
GET	/	No	List all public images
GET	/my-images	Yes	List the current user's images
GET	/liked	Yes	List images the user has liked
PUT	/:id/like	Yes	Like or unlike an image
PUT	/:id/public	Yes	Set an image public or private (owner only)
DELETE	/:id	Yes	Delete an image (owner only)

Authenticated routes expect an Authorization: Bearer <token> header.

How to Use
Sign up or log in.
Enter a design description, then choose fabric, style and occasion.
Choose whether the design is public or private, then click generate.
Browse the Gallery (public, your own, or liked designs) or open your Dashboard to manage your creations.
Roadmap
Password reset flow
Download and share actions on the dashboard
Colour, pattern and texture filters in the generator UI
Pagination for the gallery
Author

Built by Sakshi0008.
