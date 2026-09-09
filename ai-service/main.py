import os
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.api.roadmap_routes import router as roadmap_router
from app.api.routes import router




# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="PrepWise AI Service",
    description="Microservice for resume analysis and AI recommendations",
    version="1.0.0"
)

# Enable CORS so Node.js backend can call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:3000","http://localhost:5173"],  # Node backend + React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router)
app.include_router(roadmap_router)

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    Node.js backend calls this to verify AI service is running.
    """
    return {
        "status": "ok",
        "service": "PrepWise AI Service",
        "version": "1.0.0"
    }