from models import Medication, InteractionCheckResult, InteractionData, RiskLevel
from interaction_database import INTERACTION_DATABASE

# Priority mapping for risk levels
RISK_LEVEL_PRIORITY = {
    'severe': 3,
    'moderate': 2,
    'mild': 1,
    'none': 0,
}

# Display text mapping per requirements (section 5.2)
RISK_LEVEL_DISPLAY = {
    'severe': {
        'text': '【最重要】深刻な相互作用の可能性があります。専門家への相談を強く推奨します。',
        'color': 'red',
        'icon': '🔴',
    },
    'moderate': {
        'text': '【要注意】中程度の相互作用の懸念があります。専門家にご相談ください。',
        'color': 'yellow',
        'icon': '🟡',
    },
    'mild': {
        'text': '【軽度懸念】相互作用の報告があります。',
        'color': 'blue',
        'icon': '🔵',
    },
    'none': {
        'text': '【現状データでは】特段の記載はありません。',
        'color': 'green',
        'icon': '🟢',
    },
}


def check_interactions(medications: list[Medication]) -> InteractionCheckResult:
    """
    Check for drug interactions among provided medications.
    
    Logic:
    1. Check all combinations of medications
    2. Match against interaction database
    3. Return highest risk level with all found interactions
    """
    found_interactions = []
    
    # Check all medication pairs
    for i in range(len(medications)):
        for j in range(i + 1, len(medications)):
            med1 = medications[i]
            med2 = medications[j]
            
            # Use ingredient for supplements, otherwise use name
            name1 = med1.ingredient if med1.ingredient else med1.name
            name2 = med2.ingredient if med2.ingredient else med2.name
            
            # Search for matching interaction in database
            for interaction in INTERACTION_DATABASE:
                # Check both orderings
                if ((interaction['drug1'] == name1 and interaction['drug2'] == name2) or
                    (interaction['drug1'] == name2 and interaction['drug2'] == name1) or
                    (interaction['drug1'] == med1.name and interaction['drug2'] == med2.name) or
                    (interaction['drug1'] == med2.name and interaction['drug2'] == med1.name)):
                    
                    found_interactions.append(InteractionData(**interaction))
                    break
    
    # Determine highest risk level
    highest_risk: RiskLevel = 'none'
    if found_interactions:
        highest_risk = max(
            (inter.riskLevel for inter in found_interactions),
            key=lambda level: RISK_LEVEL_PRIORITY[level]
        )
    
    # Get display information
    display = RISK_LEVEL_DISPLAY[highest_risk]
    
    return InteractionCheckResult(
        riskLevel=highest_risk,
        displayText=display['text'],
        color=display['color'],
        icon=display['icon'],
        interactions=found_interactions,
    )
