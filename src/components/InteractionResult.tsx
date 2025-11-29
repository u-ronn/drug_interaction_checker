import { Card, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';
import { InteractionCheckResult } from '../types';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface InteractionResultProps {
  result: InteractionCheckResult;
}

const iconMap = {
  red: AlertTriangle,
  yellow: AlertCircle,
  blue: Info,
  green: CheckCircle,
};

const colorMap = {
  red: 'border-red-500 bg-red-50',
  yellow: 'border-yellow-500 bg-yellow-50',
  blue: 'border-blue-500 bg-blue-50',
  green: 'border-green-500 bg-green-50',
};

const textColorMap = {
  red: 'text-red-700',
  yellow: 'text-yellow-700',
  blue: 'text-blue-700',
  green: 'text-green-700',
};

export function InteractionResult({ result }: InteractionResultProps) {
  const Icon = iconMap[result.color as keyof typeof iconMap];
  const colorClass = colorMap[result.color as keyof typeof colorMap];
  const textColor = textColorMap[result.color as keyof typeof textColorMap];

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Risk Level Display (A) */}
      <Card className={`border-2 ${colorClass}`}>
        <CardContent className="pt-3 sm:pt-5">
          <div className="flex items-start gap-2.5 sm:gap-4">
            <div className="text-2xl sm:text-3xl md:text-4xl shrink-0">{result.icon}</div>
            <div className="flex-1 space-y-1.5 sm:space-y-2.5 min-w-0">
              <h2 className={`${textColor} text-sm sm:text-base leading-snug`}>{result.displayText}</h2>

              {/* Disclaimer */}
              <Alert className="bg-white/50 border-gray-300">
                <AlertDescription className="text-xs sm:text-sm">
                  <strong>免責事項：</strong>
                  本情報は診断・治療を目的としたものではありません。
                  薬の服用に関する判断は、必ず医師、薬剤師などの専門家にご相談ください。
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information (B) */}
      {result.interactions.length > 0 && (
        <Card>
          <CardContent className="pt-3 sm:pt-5">
            <Accordion type="multiple" className="w-full">
              {result.interactions.map((interaction, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2 sm:gap-3 text-left">
                      <Badge variant="outline" className="shrink-0 text-xs">
                        相互作用 {index + 1}
                      </Badge>
                      <span className="truncate text-sm sm:text-base">
                        {interaction.drug1} × {interaction.drug2}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 sm:space-y-4 pt-2">
                      {/* Mechanism */}
                      <div>
                        <h4 className="text-xs sm:text-sm text-gray-500 mb-1">
                          メカニズム（作用機序）
                        </h4>
                        <p className="text-xs sm:text-sm leading-relaxed">
                          {interaction.mechanism}
                        </p>
                      </div>

                      {/* Concerns */}
                      <div>
                        <h4 className="text-xs sm:text-sm text-gray-500 mb-1">
                          懸念される事象
                        </h4>
                        <p className="text-xs sm:text-sm leading-relaxed">
                          {interaction.concerns}
                        </p>
                      </div>

                      {/* Source */}
                      <div>
                        <h4 className="text-xs sm:text-sm text-gray-500 mb-1">
                          情報源
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {interaction.source}
                        </p>
                      </div>

                      {/* Warning */}
                      <Alert>
                        <AlertTriangle className="size-4" />
                        <AlertDescription className="text-xs leading-relaxed">
                          この情報は参考情報です。実際の影響は個人差があります。
                          必ず医療専門家にご相談ください。
                        </AlertDescription>
                      </Alert>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* No Interactions Found */}
      {result.interactions.length === 0 && result.riskLevel === 'none' && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="size-4 text-green-600" />
          <AlertDescription className="text-xs sm:text-sm">
            現在登録されている薬・サプリメントの組み合わせについて、
            サンプルデータベースには特段の相互作用の記載がありません。
            <br />
            <span className="text-xs text-gray-600 mt-2 block">
              ※ これは全ての相互作用がないことを保証するものではありません。
              新しい薬を追加する際は必ず医師・薬剤師にご相談ください。
            </span>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}