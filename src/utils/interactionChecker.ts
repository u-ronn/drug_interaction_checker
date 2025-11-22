import { Medication, InteractionCheckResult, RiskLevel } from '../types';

const API_BASE_URL = 'http://localhost:8000';

// Fallback display for when API is unavailable
const errorDisplay = {
  text: 'APIとの通信エラーが発生しました。バックエンドサーバーが起動していることを確認してください。',
  color: 'gray',
  icon: '⚠️',
};

/**
 * Check interactions by calling the Python API
 */
export async function checkInteractions(medications: Medication[]): Promise<InteractionCheckResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/check_interaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        medications: medications,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const result: InteractionCheckResult = await response.json();
    return result;

  } catch (error) {
    console.error('Failed to check interactions:', error);
    
    // Return error state
    return {
      riskLevel: 'none' as RiskLevel,
      displayText: errorDisplay.text,
      color: errorDisplay.color,
      icon: errorDisplay.icon,
      interactions: [],
    };
  }
}
