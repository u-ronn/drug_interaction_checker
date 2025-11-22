export interface Medication {
  id: string;
  name: string;
  dosage?: string;
  type: 'prescription' | 'otc' | 'supplement';
  currentlyTaking: boolean;
  ingredient?: string; // For supplements
}

export type RiskLevel = 'severe' | 'moderate' | 'mild' | 'none';

export interface InteractionData {
  drug1: string;
  drug2: string;
  riskLevel: RiskLevel;
  mechanism: string;
  concerns: string;
  source: string;
}

export interface InteractionCheckResult {
  riskLevel: RiskLevel;
  displayText: string;
  color: string;
  icon: string;
  interactions: InteractionData[];
}

export interface MedicationMaster {
  name: string;
  type: 'prescription' | 'otc' | 'supplement';
  ingredient?: string;
}
