#!/bin/bash
# Script de lancement du backend WearIT

cd "$(dirname "$0")"

echo "🚀 Démarrage du backend WearIT..."
echo "📍 Répertoire: $(pwd)"
echo ""

# Vérifier les dépendances
if ! python -c "import fastapi" 2>/dev/null; then
    echo "❌ FastAPI n'est pas installé"
    echo "📦 Installation des dépendances..."
    pip install -r requirements.txt
fi

# Vérifier le fichier .env
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env manquant"
    echo "💡 Copiez .env.example vers .env et configurez vos clés API"
    exit 1
fi

echo "✅ Prêt à démarrer"
echo ""
echo "🌐 Backend sera accessible sur:"
echo "   - http://localhost:8000"
echo "   - http://0.0.0.0:8000"
echo "   - http://192.168.1.122:8000 (depuis votre réseau local)"
echo ""
echo "📚 Documentation API: http://localhost:8000/docs"
echo ""
echo "⏸️  Pour arrêter: Ctrl+C"
echo ""

# Lancer uvicorn
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

