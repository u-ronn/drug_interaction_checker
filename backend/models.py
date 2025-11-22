from pydantic import BaseModel
from typing import Literal, Optional

# Type alias for risk levels
RiskLevel = Literal['severe', 'moderate', 'mild', 'none']
MedicationType = Literal['prescription', 'otc', 'supplement']


class Medication(BaseModel):
    """Single medication entry"""
    id: str
    name: str
    dosage: Optional[str] = None
    type: MedicationType
    currentlyTaking: bool
    ingredient: Optional[str] = None  # For supplements


class InteractionCheckRequest(BaseModel):
    """Request payload for interaction check endpoint"""
    medications: list[Medication]


class InteractionData(BaseModel):
    """Single interaction record"""
    drug1: str
    drug2: str
    riskLevel: RiskLevel
    mechanism: str
    concerns: str
    source: str


class InteractionCheckResult(BaseModel):
    """Complete interaction check result"""
    riskLevel: RiskLevel
    displayText: str
    color: str
    icon: str
    interactions: list[InteractionData]
