import { useState } from 'react';
import { Button } from './ui/button';
import { Medication, InteractionCheckResult } from '../types';
import { FileDown, Loader2 } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';

interface ActionBarProps {
  medications: Medication[];
  result: InteractionCheckResult;
}

export function ActionBar({ medications, result }: ActionBarProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      await generatePDF(medications, result);
    } catch (error) {
      console.error('PDF生成エラー:', error);
      alert('PDF生成中にエラーが発生しました。');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <Button
          onClick={handleGeneratePDF}
          disabled={isGenerating}
          className="w-full text-sm sm:text-base"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="size-4 sm:size-5 mr-2 animate-spin" />
              PDF生成中...
            </>
          ) : (
            <>
              <FileDown className="size-4 sm:size-5 mr-2" />
              情報をPDF化・共有
            </>
          )}
        </Button>
      </div>
    </div>
  );
}