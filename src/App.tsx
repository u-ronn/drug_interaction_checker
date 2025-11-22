import { useState, useEffect } from 'react';
import { DisclaimerModal } from './components/DisclaimerModal';
import { MedicationInput } from './components/MedicationInput';
import { MedicationList } from './components/MedicationList';
import { InteractionResult } from './components/InteractionResult';
import { ActionBar } from './components/ActionBar';
import { checkInteractions } from './utils/interactionChecker';
import { Medication, InteractionCheckResult } from './types';
import { Pill } from 'lucide-react';

export default function App() {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [interactionResult, setInteractionResult] = useState<InteractionCheckResult | null>(null);

  // Load medications from Local Storage on mount
  useEffect(() => {
    const agreed = localStorage.getItem('agreedToTerms');
    if (agreed === 'true') {
      setAgreedToTerms(true);
    }

    const stored = localStorage.getItem('medications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setMedications(parsed);
      } catch (error) {
        console.error('Failed to parse medications:', error);
      }
    }
  }, []);

  // Check interactions whenever medications change (async API call)
  useEffect(() => {
    const performCheck = async () => {
      if (medications.length > 0) {
        const result = await checkInteractions(medications);
        setInteractionResult(result);
      } else {
        setInteractionResult(null);
      }
    };

    performCheck();
  }, [medications]);

  // Save medications to Local Storage
  const saveMedications = (newMedications: Medication[]) => {
    setMedications(newMedications);
    localStorage.setItem('medications', JSON.stringify(newMedications));
  };

  const handleAgree = () => {
    localStorage.setItem('agreedToTerms', 'true');
    setAgreedToTerms(true);
  };

  const handleAddMedication = (medication: Medication) => {
    saveMedications([...medications, medication]);
  };

  const handleDeleteMedication = (id: string) => {
    saveMedications(medications.filter(med => med.id !== id));
  };

  if (!agreedToTerms) {
    return <DisclaimerModal onAgree={handleAgree} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Pill className="size-6 sm:size-8 text-blue-600 shrink-0" />
            <div className="min-w-0">
              <h1 className="text-blue-600 truncate">薬の相互作用チェッカー</h1>
              <p className="text-xs sm:text-sm text-gray-600 truncate">情報提供ツール（医療機器ではありません）</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Input Section */}
        <MedicationInput onAdd={handleAddMedication} />

        {/* Medication List */}
        {medications.length > 0 && (
          <MedicationList
            medications={medications}
            onDelete={handleDeleteMedication}
          />
        )}

        {/* Interaction Result */}
        {interactionResult && (
          <div id="interaction-result-section">
            <InteractionResult result={interactionResult} />
          </div>
        )}

        {/* Ad Area */}
        {medications.length > 0 && (
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center">
            <p className="text-gray-500 text-sm">広告エリア</p>
            <p className="text-gray-400 text-xs mt-1">※ 医療情報とは明確に区別されています</p>
          </div>
        )}
      </main>

      {/* Action Bar */}
      {interactionResult && (
        <ActionBar medications={medications} result={interactionResult} />
      )}
    </div>
  );
}