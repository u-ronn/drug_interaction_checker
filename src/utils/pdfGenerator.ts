import { jsPDF } from 'jspdf';
import { Medication, InteractionCheckResult } from '../types';

// Japanese font support for jsPDF
// Note: For production, you would need to add a proper Japanese font
// This is a simplified version for the MVP

export async function generatePDF(
  medications: Medication[],
  result: InteractionCheckResult
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let yPos = 20;
  const leftMargin = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const contentWidth = pageWidth - 40;

  // Title
  pdf.setFontSize(20);
  pdf.text('薬の相互作用チェック結果', leftMargin, yPos);
  yPos += 10;

  // Date
  pdf.setFontSize(10);
  const today = new Date().toLocaleDateString('ja-JP');
  pdf.text(`生成日: ${today}`, leftMargin, yPos);
  yPos += 15;

  // Medications List
  pdf.setFontSize(14);
  pdf.text('登録薬剤一覧', leftMargin, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  medications.forEach((med, index) => {
    const typeLabel = med.type === 'prescription' ? '処方薬' : med.type === 'otc' ? '市販薬' : 'サプリ';
    const status = med.currentlyTaking ? '服用中' : '服用停止';
    const dosageText = med.dosage ? ` (${med.dosage})` : '';
    const ingredientText = med.ingredient ? ` [${med.ingredient}]` : '';
    
    const text = `${index + 1}. ${med.name}${dosageText}${ingredientText} - ${typeLabel} - ${status}`;
    
    // Simple text wrapping
    const lines = pdf.splitTextToSize(text, contentWidth);
    lines.forEach((line: string) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(line, leftMargin, yPos);
      yPos += 6;
    });
  });

  yPos += 10;

  // Risk Level
  pdf.setFontSize(14);
  pdf.text('相互作用リスクレベル', leftMargin, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  const riskText = result.displayText;
  const riskLines = pdf.splitTextToSize(riskText, contentWidth);
  riskLines.forEach((line: string) => {
    if (yPos > 270) {
      pdf.addPage();
      yPos = 20;
    }
    pdf.text(line, leftMargin, yPos);
    yPos += 6;
  });

  yPos += 10;

  // Interactions Details
  if (result.interactions.length > 0) {
    pdf.setFontSize(14);
    pdf.text('相互作用の詳細', leftMargin, yPos);
    yPos += 8;

    result.interactions.forEach((interaction, index) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFontSize(12);
      pdf.text(`${index + 1}. ${interaction.drug1} × ${interaction.drug2}`, leftMargin, yPos);
      yPos += 7;

      pdf.setFontSize(10);
      
      // Mechanism
      pdf.text('メカニズム:', leftMargin + 5, yPos);
      yPos += 5;
      const mechanismLines = pdf.splitTextToSize(interaction.mechanism, contentWidth - 5);
      mechanismLines.forEach((line: string) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(line, leftMargin + 5, yPos);
        yPos += 5;
      });
      yPos += 3;

      // Concerns
      pdf.text('懸念される事象:', leftMargin + 5, yPos);
      yPos += 5;
      const concernsLines = pdf.splitTextToSize(interaction.concerns, contentWidth - 5);
      concernsLines.forEach((line: string) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(line, leftMargin + 5, yPos);
        yPos += 5;
      });
      yPos += 3;

      // Source
      pdf.text(`情報源: ${interaction.source}`, leftMargin + 5, yPos);
      yPos += 10;
    });
  }

  yPos += 5;

  // Disclaimer
  if (yPos > 240) {
    pdf.addPage();
    yPos = 20;
  }

  pdf.setFontSize(12);
  pdf.text('免責事項', leftMargin, yPos);
  yPos += 7;

  pdf.setFontSize(9);
  const disclaimer = [
    '・本情報は診断・治療を目的としたものではありません。',
    '・薬の服用に関する判断は、必ず医師、薬剤師などの専門家にご相談ください。',
    '・本アプリは情報提供ツールであり、医療機器ではありません。',
    '・すべての相互作用を網羅しているわけではありません。',
    '・個人の健康状態や体質により影響は異なります。',
  ];

  disclaimer.forEach(line => {
    if (yPos > 270) {
      pdf.addPage();
      yPos = 20;
    }
    const lines = pdf.splitTextToSize(line, contentWidth);
    lines.forEach((l: string) => {
      pdf.text(l, leftMargin, yPos);
      yPos += 5;
    });
  });

  // Generate and download
  const filename = `薬相互作用チェック_${today.replace(/\//g, '')}.pdf`;
  pdf.save(filename);
}
