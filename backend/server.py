from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
import logging
import os

# Import routers
from routers import auth

# Import database initialization
from database import init_db

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(title="Clone X API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create API router with prefix
api_router = APIRouter(prefix="/api")

# Basic health check route
@api_router.get("/")
async def root():
    return {"message": "Clone X API is running", "version": "1.0.0"}

# Include authentication routes
api_router.include_router(auth.router)

# Include the API router in main app
app.include_router(api_router)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Clone X API...")
    await init_db()
    logger.info("Database indexes initialized")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Clone X API...")