# Backend API

Python FastAPI backend for drug interaction checking.

## Setup

1. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Run the development server:
   ```bash
   python -m uvicorn main:app --reload
   ```

   Or alternatively:
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

### `GET /`
Health check endpoint

### `POST /api/check_interaction`
Check for drug interactions

Request body:
```json
{
  "medications": [
    {
      "id": "1",
      "name": "ワーファリン",
      "type": "prescription",
      "currentlyTaking": true
    }
  ]
}
```

Response:
```json
{
  "riskLevel": "severe",
  "displayText": "【最重要】深刻な相互作用の可能性があります。専門家への相談を強く推奨します。",
  "color": "red",
  "icon": "🔴",
  "interactions": [...]
}
```
