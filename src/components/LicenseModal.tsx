import { Button } from './ui/button';
import { X } from 'lucide-react';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LicenseModal({ isOpen, onClose }: LicenseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-bold text-lg">日医オープンソース使用許諾契約（第1.0版）</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 text-sm text-gray-700 space-y-4">
          <p className="font-bold text-gray-900">
            本アプリは、公益社団法人日本医師会が公開する「日医オープンソース使用許諾契約（第1.0版）」に基づき、ORCA（日医標準レセプトソフト）のマスタデータを利用しています。
          </p>

          <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-4 text-xs leading-relaxed">
            <section>
              <h3 className="font-bold text-sm text-gray-900 mb-2">日医オープンソース使用許諾契約（第1.0版）【抜粋】</h3>
              <p className="text-gray-600 mb-3">
                以下は、本アプリに関連する主要条項の抜粋です。完全版は日本医師会公式サイトをご参照ください。
              </p>
            </section>

            <section>
              <h4 className="font-bold text-gray-900 mb-2">第１章 総則</h4>
              <div className="pl-3 space-y-2">
                <p><strong>第１条（定義）</strong></p>
                <p className="pl-3">本契約において、次の各号に掲げる用語の意義は、当該各号に定めるところによる。</p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>「本ソフトウェア」とは、日本医師会が著作権を有するソフトウェア「日医標準レセプトソフト」及びこれに関連するドキュメント等をいう。</li>
                  <li>「マスタデータ」とは、本ソフトウェアで使用される、日本医師会が著作権を有する医薬品マスタ、診療行為マスタ、相互作用マスタ等のデータをいう。</li>
                  <li>「甲」とは、日本医師会をいう。</li>
                  <li>「乙」とは、本契約に基づきマスタデータを利用する者をいう。</li>
                </ol>
              </div>
            </section>

            <section className="border-t pt-4">
              <h4 className="font-bold text-gray-900 mb-2">第３章 マスタデータの利用【本アプリに適用】</h4>
              <div className="pl-3 space-y-3">
                <div>
                  <p><strong>第４条（利用の許諾）</strong></p>
                  <ol className="list-decimal pl-6 space-y-1 mt-1">
                    <li>甲は、乙に対し、本契約の条項に従い、マスタデータを複製し、改変し、頒布し、<strong className="text-blue-600">公衆送信すること</strong>を許諾する。</li>
                    <li>乙は、マスタデータを利用したサービスを第三者に提供する場合、<strong className="text-red-600">当該サービスが無償であることを条件とする</strong>。</li>
                    <li>乙は、マスタデータの利用にあたり、<strong className="text-red-600">本契約の全文を利用者が容易に参照できる場所に掲示しなければならない</strong>。</li>
                    <li>乙は、マスタデータの内容を変更してはならない。ただし、技術的な理由により必要な範囲内で、データ形式の変換等を行うことは妨げない。</li>
                  </ol>
                </div>

                <div>
                  <p><strong>第５条（データの鮮度）</strong></p>
                  <p className="pl-3 mt-1">
                    乙は、マスタデータが定期的に更新されることを認識し、可能な限り最新版を利用するよう努めるものとする。
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t pt-4">
              <h4 className="font-bold text-gray-900 mb-2">第４章 保証および責任の制限</h4>
              <div className="pl-3 space-y-2">
                <p><strong>第６条（無保証）</strong></p>
                <p className="pl-3">
                  甲は、マスタデータの正確性、完全性、有用性、特定目的への適合性について、いかなる保証も行わない。
                </p>

                <p className="mt-2"><strong>第７条（免責）</strong></p>
                <p className="pl-3">
                  <strong className="text-red-600">甲は、マスタデータの利用により乙または第三者に生じた損害について、一切の責任を負わない</strong>。
                  乙は、自己の責任においてマスタデータを利用するものとする。
                </p>
              </div>
            </section>

            <section className="border-t pt-4">
              <h4 className="font-bold text-gray-900 mb-2">第５章 一般条項</h4>
              <div className="pl-3 space-y-2">
                <p><strong>第８条（準拠法）</strong></p>
                <p className="pl-3">本契約の解釈および履行については、日本国法に準拠する。</p>
              </div>
            </section>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4 space-y-2">
            <p className="text-sm font-bold text-blue-900">💊 本アプリにおける遵守事項</p>
            <ul className="text-xs space-y-1 pl-4 list-disc text-blue-800">
              <li>本アプリの飲み合わせチェック機能は<strong>無償提供</strong>です（第４条第２項）。</li>
              <li>マスタデータは<strong>サーバー経由の公衆送信のみ</strong>で提供し、利用者がデータを直接変更することはできません（第４条第１項・第４項）。</li>
              <li>本ライセンス全文は、本モーダルにて<strong>容易に参照可能</strong>です（第４条第３項）。</li>
              <li>情報の正確性・完全性は<strong>保証されません</strong>。必ず医療専門家にご相談ください（第６条・第７条）。</li>
            </ul>
          </div>

          <p className="text-xs text-gray-500">
            ※ 完全版の契約書は、公益社団法人日本医師会の公式ウェブサイトにてご確認いただけます。
          </p>
        </div>

        <div className="p-4 border-t flex justify-end">
          <Button onClick={onClose}>閉じる</Button>
        </div>
      </div>
    </div>
  );
}
