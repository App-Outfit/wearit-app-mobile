# WearIT

**AI-powered Virtual Try-On App**

---

## Prerequisites

* **Python 3.10+**
* **Node.js 16+** & **npm**
* (Optional) **Expo CLI** (`npm install -g expo-cli`)

---

## Setup

```bash
# 1. Clone repository
git clone https://github.com/App-Outfit/wearit-app-mobile.git
cd wearit-app-mobile

# 2. Copy and update env file
cp .env.example .env
# Edit .env to set your DATABASE_URL, SECRET_KEY, AI_API_KEY, API_URL, etc.
```

---

## Backend

```bash
cd backend
# Create & activate virtual env
python -m venv .venv && source .venv/bin/activate
# Install dependencies
pip install -r requirements.txt
# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

* **API**: [http://localhost:8000/api/v1](http://localhost:8000/api/v1)
* **Docs**: [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)

---

## Frontend

```bash
cd frontend
npm install
npm start --reset-cache
```

* Launch Expo on simulator or mobile via Expo Go.

---

## Tests

* **Backend**: `cd backend && pytest tests/ -v`
* **Frontend**: `cd frontend && npm test`

---

## Contributing

1. Fork & branch off `develop` (feature/xyz)
2. Follow Conventional Commits
3. Open a PR; ensure CI passes

---