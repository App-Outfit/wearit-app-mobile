# WearIT

Application mobile de Virtual Try-On (VTO) permettant d'essayer virtuellement des vêtements grâce à l'IA.

## 🚀 Technologies

- **Frontend** : React Native, Expo, TypeScript, Redux Toolkit
- **Backend** : FastAPI, Python, MongoDB, AWS S3
- **IA** : Replicate API pour le VTO
- **Paiements** : Stripe
- **Documentation** : Sphinx

## 📋 Prérequis

- **Node.js 16+** & **npm**
- **Python 3.10+**
- **MongoDB**
- **Comptes AWS S3, Replicate, Stripe**

## ⚡ Installation

```bash
# 1. Cloner le repository
git clone https://github.com/App-Outfit/wearit-app-mobile.git
cd wearit-app-mobile

# 2. Configuration des variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés API
```

## 🔧 Configuration

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# ou .venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**API** : http://localhost:8000/api/v1  
**Docs** : http://localhost:8000/api/v1/docs

### Frontend

```bash
cd app
npm install
npm start
```

## 🧪 Tests

```bash
# Backend
cd backend && pytest tests/ -v

# Frontend
cd app && npm test
```

## 📱 Build & Déploiement

### Développement
```bash
eas build --profile development --platform ios
npx expo start --dev-client
```

### Production
```bash
eas build --platform ios --profile production
eas submit -p ios --latest
```

## 📚 Documentation

```bash
cd docs
./generate_docs.sh html      # Générer la documentation
./generate_docs.sh serve     # Serveur de développement
```

**Documentation en ligne** : https://wearit-app-mobile.readthedocs.io

## 🤝 Contribution

1. Fork & branche depuis `develop` (feature/xyz)
2. Suivre les [Conventional Commits](https://conventionalcommits.org)
3. Ouvrir une PR avec CI validé

## 📄 Licence

0BSD