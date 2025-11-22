from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import InteractionCheckRequest, InteractionCheckResult
from interaction_checker import check_interactions
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Drug Interaction Checker API",
    description="API for checking drug and supplement interactions",
    version="1.0.0",
)

# CORS configuration - allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default dev server
        "http://localhost:3000",  # Alternative port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "Drug Interaction Checker API is running",
    }


@app.post("/api/check_interaction", response_model=InteractionCheckResult)
async def check_interaction(request: InteractionCheckRequest):
    """
    Check for interactions between provided medications.
    
    Endpoint: POST /api/check_interaction
    
    Request Body:
    {
        "medications": [
            {
                "id": "1",
                "name": "ワーファリン",
                "type": "prescription",
                "currentlyTaking": true
            },
            ...
        ]
    }
    
    Returns: InteractionCheckResult with risk level and details
    """
    try:
        logger.info(f"Checking interactions for {len(request.medications)} medications")
        
        if not request.medications:
            # No medications - return "none" risk level
            return InteractionCheckResult(
                riskLevel='none',
                displayText='【現状データでは】特段の記載はありません。',
                color='green',
                icon='🟢',
                interactions=[],
            )
        
        result = check_interactions(request.medications)
        logger.info(f"Found {len(result.interactions)} interactions, highest risk: {result.riskLevel}")
        
        return result
        
    except Exception as e:
        logger.error(f"Error checking interactions: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
