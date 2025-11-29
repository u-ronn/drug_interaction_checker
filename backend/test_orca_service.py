from orca_service import OrcaApiService
from models import Medication
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

def test_service():
    service = OrcaApiService()
    
    # Test Case 1: No interactions (Empty)
    print("Testing empty list...")
    results = service.check_interactions([])
    print(f"Results: {results}")
    assert len(results) == 0

    # Test Case 2: Mock Interaction (Warfarin + Loxoprofen)
    print("\nTesting Warfarin + Loxoprofen (Mock)...")
    meds = [
        Medication(id="1", name="ワーファリン", type="prescription", currentlyTaking=True),
        Medication(id="2", name="ロキソニン", type="prescription", currentlyTaking=True)
    ]
    results = service.check_interactions(meds)
    print(f"Results: {len(results)} interactions found.")
    for r in results:
        print(f" - {r.drug1} vs {r.drug2}: {r.riskLevel} ({r.concerns})")
        print(f"   Source: {r.source}")

    if len(results) > 0:
        print("\nSUCCESS: Mock interaction detected.")
    else:
        print("\nFAILURE: Mock interaction NOT detected.")

if __name__ == "__main__":
    test_service()
