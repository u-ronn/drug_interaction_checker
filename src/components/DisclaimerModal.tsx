import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { AlertTriangle } from 'lucide-react';

interface DisclaimerModalProps {
  onAgree: () => void;
}

export function DisclaimerModal({ onAgree }: DisclaimerModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const element = contentRef.current;
    if (!element) return;

    // Check if scrolled to bottom (with 50px buffer)
    const isBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 50;

    if (isBottom) {
      setHasRead(true);
    }
  };

  // Check if content fits without scrolling (rare but possible on large screens)
  useEffect(() => {
    const element = contentRef.current;
    if (element) {
      // If content fits (scrollHeight <= clientHeight), mark as read immediately
      if (element.scrollHeight <= element.clientHeight) {
        setHasRead(true);
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center p-3 sm:p-4 z-50 backdrop-blur-sm">
      <div
        className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-3 sm:p-4 md:p-5 border-b bg-red-50 flex items-center gap-2.5 md:gap-4 shrink-0">
          <div className="bg-red-100 p-2 md:p-3 rounded-full shrink-0">
            <AlertTriangle className="size-6 md:size-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900">【重要】本アプリの利用に関する同意事項</h2>
            <p className="text-xs md:text-sm text-gray-600 mt-1">ご利用前に必ず最後までお読みください。同意なしでは利用できません。</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 text-sm text-gray-700 leading-relaxed space-y-3 md:space-y-5 min-h-0"
        >
          <section>
            <h3 className="font-bold text-gray-900 text-base mb-3">1. 本アプリの提供情報と目的</h3>
            <p className="mb-2">
              本アプリは、お客様が入力された医薬品情報に基づき、併用時の相互作用の可能性を情報として参照いただくことを目的としています。
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <li>
                <span className="font-bold text-gray-900">医療行為の代替ではありません:</span><br />
                <span className="pl-5 block">本アプリから提供される情報は、医療における診断、治療、処方、または専門的なアドバイスに代わるものではありません。</span>
              </li>
              <li>
                <span className="font-bold text-gray-900">判断の主体と責任:</span><br />
                <span className="pl-5 block">アプリの利用判断および結果の解釈は、お客様ご自身の責任において行ってください。</span>
              </li>
              <li>
                <span className="font-bold text-gray-900">必ず専門家にご相談ください:</span><br />
                <span className="pl-5 block">飲み合わせに関する懸念事項が生じた場合、また体調に不安がある場合は、<strong className="text-red-600">必ず</strong>医師または薬剤師にご相談ください。本アプリの利用をもって、専門家への相談を省略することはできません。</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 text-base mb-3">2. データソースおよび責任範囲について（免責事項）</h3>
            <p className="mb-2">
              本アプリは、公益社団法人日本医師会が公開する「日医オープンソース使用許諾契約（第1.0版）」に基づくマスタデータを基盤として利用しています。
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <li>
                <span className="font-bold text-gray-900">情報源の保証の限界:</span><br />
                <span className="pl-5 block">本アプリは、提供される情報（相互作用データ、作用機序等）の正確性、完全性、最新性、有用性について、いかなる保証も行いません。</span>
              </li>
              <li>
                <span className="font-bold text-gray-900">責任の明確化:</span><br />
                <span className="pl-5 block">データ提供元である日本医師会および、本アプリの提供者・開発者は、本アプリの利用によってお客様または第三者に生じたいかなる損害（健康被害、逸失利益等）に対しても、<strong className="text-red-600">一切の責任を負いません</strong>。</span>
              </li>
              <li>
                <span className="font-bold text-gray-900">自己責任原則の適用:</span><br />
                <span className="pl-5 block">お客様は、上記のリスクおよび免責事項を理解し、ご自身の責任と費用において本アプリを利用することに同意するものとします。</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 text-base mb-3">3. 利用者に遵守いただく事項</h3>
            <ul className="list-disc list-inside space-y-2 pl-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <li>
                <span className="font-bold text-gray-900">正確な情報入力:</span><br />
                <span className="pl-5 block">飲み合わせチェックを行う際は、処方薬だけでなく、服用中の一般用医薬品（市販薬）、サプリメント、健康食品など、すべての情報を正確に入力してください。</span>
              </li>
              <li>
                <span className="font-bold text-gray-900">専門家への情報提供:</span><br />
                <span className="pl-5 block">本アプリで「併用注意」や「併用禁忌」の可能性が示された場合、その結果（具体的な症状や作用機序を含む）を専門家へ提示し、必ず指示を受けてください。</span>
              </li>
              <li>
                <span className="font-bold text-gray-900">ライセンスの遵守:</span><br />
                <span className="pl-5 block">本機能やデータを第三者に再提供したり、営利目的で利用したりすることは禁止します。</span>
              </li>
            </ul>
          </section>

          {/* Scroll Indicator (visible only if not read) */}
          {!hasRead && (
            <div className="text-center text-blue-600 text-xs animate-bounce py-2">
              ▼ 最後までスクロールして確認してください ▼
            </div>
          )}
        </div>

        {/* Footer / Action Area */}
        <div className="p-3 sm:p-4 md:p-5 border-t bg-gray-50 rounded-b-xl space-y-2.5 sm:space-y-3 shrink-0">
          <div className="flex items-start gap-3 p-3 md:p-4 bg-white border border-gray-200 rounded-lg">
            <Checkbox
              id="agree-terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
              disabled={!hasRead}
              className="mt-1 shrink-0 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
            />
            <label
              htmlFor="agree-terms"
              className={`text-sm leading-relaxed cursor-pointer ${!hasRead ? 'text-gray-400' : 'text-gray-900'}`}
            >
              私は、上記「本アプリの利用に関する同意事項」の全文を確認し、内容を理解した上で、これに同意し、本アプリを自己責任において利用します。
            </label>
          </div>

          <Button
            onClick={onAgree}
            disabled={!agreed || !hasRead}
            className="w-full text-lg py-6 font-bold shadow-lg transition-all"
            size="lg"
            variant={agreed && hasRead ? "default" : "secondary"}
          >
            {!hasRead ? "最後までお読みください" : "同意して利用を開始する"}
          </Button>
        </div>
      </div>
    </div>
  );
}