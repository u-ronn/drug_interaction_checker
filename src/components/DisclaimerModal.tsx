import { useState } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { AlertTriangle } from 'lucide-react';

interface DisclaimerModalProps {
  onAgree: () => void;
}

export function DisclaimerModal({ onAgree }: DisclaimerModalProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b">
            <AlertTriangle className="size-6 sm:size-8 text-amber-600 shrink-0" />
            <div className="min-w-0">
              <h2 className="truncate">利用規約と免責事項</h2>
              <p className="text-xs sm:text-sm text-gray-600">ご利用前に必ずお読みください</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3 sm:space-y-4 text-sm">
            <section>
              <h3 className="text-red-600 mb-2">【重要】本アプリの位置付け</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li>本アプリは<strong>「情報提供ツール」</strong>であり、薬機法上の医療機器ではありません。</li>
                <li>本アプリは診断、治療、予防を目的とするものではありません。</li>
                <li>医療行為の代替となるものではありません。</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-2">情報の正確性について</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li>本アプリが提供する情報は、サンプルデータに基づくものです。</li>
                <li>すべての相互作用を網羅しているわけではありません。</li>
                <li>個人の健康状態や体質により影響は異なります。</li>
                <li>情報の正確性、完全性、有用性について保証するものではありません。</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-2">免責事項</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li>本アプリの利用により生じた損害について、当方は一切の責任を負いません。</li>
                <li>薬の服用に関する判断は、必ず医師、薬剤師などの専門家にご相談ください。</li>
                <li>服用中の薬を自己判断で中止・変更しないでください。</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-2">データの取り扱い</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li>本アプリは匿名利用を前提としています。</li>
                <li>入力された服薬情報は、お使いのデバイスにのみ保存されます。</li>
                <li>本アプリは個人を特定できる情報（PII）の収集を意図していません。</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-2">必ず専門家へご相談を</h3>
              <p className="text-gray-700 text-sm">
                相互作用の可能性が表示された場合、また表示されない場合でも、
                薬の服用に関しては必ず医師、薬剤師などの医療専門家にご相談ください。
              </p>
            </section>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-3 pt-3 sm:pt-4 border-t">
            <Checkbox
              id="agree-terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
              className="mt-1 shrink-0"
            />
            <label
              htmlFor="agree-terms"
              className="text-xs sm:text-sm cursor-pointer leading-relaxed"
            >
              上記の利用規約、免責事項を理解し、同意します。
            </label>
          </div>

          {/* Action Button */}
          <Button
            onClick={onAgree}
            disabled={!agreed}
            className="w-full"
            size="lg"
          >
            同意して利用を開始する
          </Button>
        </div>
      </div>
    </div>
  );
}