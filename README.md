# 💊 Drug Interaction Checker App

薬の飲み合わせチェッカー - ORCA API 連携システム

## 概要

本アプリケーションは、公益社団法人日本医師会が提供する **ORCA（日医標準レセプトソフト）** のマスタデータを活用し、薬剤の相互作用情報を一般利用者向けに提供する情報提供ツールです。

> [!IMPORTANT]
> **本アプリは医療行為の代替ではありません。**
> 
> 提供される情報は参考情報であり、診断・治療・処方の判断には使用できません。薬剤の服用に関する判断は**必ず医師・薬剤師などの専門家にご相談ください**。

## ⚖️ 法的コンプライアンス

本アプリケーションは、**日医オープンソース使用許諾契約（第1.0版）** に基づき開発・運用されています。

### 遵守事項

✅ **無償提供**: 飲み合わせチェック機能は無償で提供されます（第4条第2項）  
✅ **データの改変禁止**: マスタデータはサーバー経由の公衆送信のみで提供し、利用者による直接変更はできません（第4条第4項）  
✅ **ライセンス明示**: 契約全文はアプリ内の「ライセンスモーダル」から容易に参照可能です（第4条第3項）  
✅ **免責事項**: 情報の正確性・完全性は保証されません。利用は自己責任です（第6条・第7条）

詳細は [API_CONNECTION_DOCS.md](./API_CONNECTION_DOCS.md) をご参照ください。

## 🏗️ システム構成

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **UI Components**: Radix UI + TailwindCSS
- **PDF Export**: jsPDF

### Backend
- **Framework**: FastAPI (Python 3.9+)
- **API**: ORCA API (ORAPI021R4V2)
- **Data Source**: ORCA Master Data (Japan Medical Association)

## 🚀 セットアップ

### 1. 前提条件

- Node.js 18+ および npm
- Python 3.9+
- （オプション）ORCA サーバーへのアクセス権

### 2. リポジトリのクローンと依存関係のインストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd drug_interaction_checker

# フロントエンド依存関係のインストール
npm install

# バックエンド依存関係のインストール
cd backend
pip install -r requirements.txt
cd ..
```

### 3. 環境変数の設定

```bash
# バックエンド設定ファイルのコピー
cp backend/.env.example backend/.env

# .env ファイルを編集して ORCA API の接続情報を設定
# 開発時は ORCA_MOCK_MODE=true のままで問題ありません
```

**主要な環境変数**:
- `ORCA_API_URL`: ORCA API のエンドポイント
- `ORCA_USER`: ORCA API の認証ユーザー名
- `ORCA_PASSWORD`: ORCA API の認証パスワード
- `DUMMY_PATIENT_ID`: 汎用チェック用のダミー患者ID（デフォルト: 99999999）
- `ORCA_MOCK_MODE`: モックモード（`true` で実ORCA不要、開発用）

詳細は [API_CONNECTION_DOCS.md](./API_CONNECTION_DOCS.md) を参照してください。

### 4. アプリケーションの起動

#### バックエンドサーバーの起動

```bash
cd backend
python main.py
```

バックエンドは `http://localhost:8000` で起動します。

#### フロントエンドサーバーの起動

別のターミナルで:

```bash
npm run dev
```

フロントエンドは `http://localhost:5173` で起動します。

### 5. ブラウザでアクセス

`http://localhost:5173` をブラウザで開くと、DisclaimerModal（免責事項同意モーダル）が表示されます。内容を確認し、同意すると薬剤登録画面が表示されます。

## 📖 使い方

1. **免責事項への同意**: 初回起動時に表示されるモーダルを最後までスクロールし、チェックボックスをチェックして同意します。
2. **薬剤の登録**: 薬剤名を入力して登録します（処方薬、市販薬、サプリメントに対応）。
3. **相互作用の確認**: 複数の薬剤を登録すると、自動的に相互作用がチェックされます。
4. **結果の確認**: リスクレベル（🔴重大、🟡注意、🔵軽度、🟢問題なし）と詳細情報が表示されます。
5. **PDF 出力**: 結果を PDF で保存できます（専門家への相談時に活用）。

## 🔧 開発モード（Mock）

ORCA サーバーがない環境でも開発・テストが可能です:

```bash
# backend/.env で以下を設定
ORCA_MOCK_MODE=true
```

モックモードでは、以下の組み合わせで相互作用が検出されます（例）:
- **ワーファリン** × **ロキソニン**: 併用注意（出血傾向増強）
- **ワーファリン** × **アスピリン**: 併用注意（出血傾向増強）

> [!WARNING]
> モックモードは実際のORCAマスタデータを使用していません。**本番環境では必ず実ORCA APIに接続してください**。

## 📦 本番ビルド

### フロントエンド

```bash
npm run build
```

ビルド成果物は `dist/` フォルダに出力されます。

### バックエンド

FastAPI アプリケーションを Uvicorn または Gunicorn で起動:

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 🛡️ セキュリティ上の注意

- **HTTPS 必須**: 本番環境では必ず HTTPS を使用してください。
- **環境変数の保護**: ORCA 認証情報は環境変数で管理し、ソースコードに含めないでください。
- **CORS 設定**: 本番環境では `backend/main.py` の CORS 設定を適切に制限してください。
- **ファイアウォール**: ORCA サーバーは外部からアクセスできないよう保護してください。

## 📋 データ鮮度の担保

ORCA マスタデータは定期的に更新されます。最新の相互作用情報を提供するため、以下を推奨します:

- **更新頻度**: 月次（日本医師会のマスタデータ更新スケジュールに準拠）
- **確認方法**: ORCA サーバーにログインし、現在のマスタバージョンを確認
- **更新手順**: [API_CONNECTION_DOCS.md](./API_CONNECTION_DOCS.md) の「Data Freshness」セクションを参照

## 🧪 テスト

### バックエンドテスト

```bash
cd backend
python test_orca_service.py
```

### 手動テスト

1. DisclaimerModal の動作確認（スクロール検知、同意強制）
2. 薬剤登録と相互作用検出の確認
3. レスポンシブデザインの確認（モバイル、タブレット、デスクトップ）
4. PDF 出力機能の確認

詳細は実装計画の「Verification Plan」セクションを参照してください。

## 📄 ライセンス

本アプリケーションのソースコードは独自ライセンスです。

**ORCA マスタデータ**の利用は、**日医オープンソース使用許諾契約（第1.0版）** に準拠しています。詳細はアプリ内の「ライセンスモーダル」または日本医師会公式サイトをご参照ください。

## 🙏 謝辞

本アプリケーションは、公益社団法人日本医師会が提供する ORCA（日医標準レセプトソフト）のマスタデータを利用しています。関係各位に深く感謝申し上げます。

## 📞 お問い合わせ

薬剤の服用に関する具体的なご相談は、必ず医師・薬剤師などの医療専門家にお願いいたします。本アプリケーションに関する技術的なお問い合わせは、リポジトリの Issue よりお願いします。

---

**Original Figma Design**: [Drug-Interaction-Checker-App](https://www.figma.com/design/SCIL0DXqRsX1opJpnIi6T0/Drug-Interaction-Checker-App)
  