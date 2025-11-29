import { useState, useEffect } from 'react';
import { DisclaimerModal } from './components/DisclaimerModal';
import { LicenseModal } from './components/LicenseModal';
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
  const [isLicenseOpen, setIsLicenseOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
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
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-5 space-y-3 sm:space-y-5">
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
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
            <p className="text-gray-500 text-sm">広告エリア</p>
            <p className="text-gray-400 text-xs mt-1">※ 医療情報とは明確に区別されています</p>
          </div>
        )}
      </main>

      {/* Action Bar */}
      {interactionResult && (
        <ActionBar medications={medications} result={interactionResult} />
      )}

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-500 text-xs">
        <button
          onClick={() => setIsLicenseOpen(true)}
          className="hover:text-blue-600 underline decoration-dotted"
        >
          このアプリについて / ライセンス
        </button>
        <p className="mt-2">© 2024 Drug Interaction Checker</p>
      </footer>

      <LicenseModal isOpen={isLicenseOpen} onClose={() => setIsLicenseOpen(false)} />
    </div>
  );
}