#!/bin/bash
# Script robuste pour lancer le backend

cd "$(dirname "$0")"

echo "🛑 Arrêt des anciens processus..."
pkill -9 -f "uvicorn app.main" 2>/dev/null
lsof -ti:8000 | xargs -r kill -9 2>/dev/null
sleep 2

echo "✅ Port 8000 libéré"
echo ""

if [ ! -f ".env" ]; then
    echo "❌ Fichier .env manquant!"
    exit 1
fi

echo "🚀 Démarrage du backend en arrière-plan..."
echo "📝 Logs: $(pwd)/backend_output.log"
echo ""

# Utiliser nohup pour vraiment détacher du terminal
nohup python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 \
    > backend_output.log 2>&1 &

BACKEND_PID=$!
echo $BACKEND_PID > backend.pid

echo "✅ Backend démarré (PID: $BACKEND_PID)"
echo ""
echo "Vérification du démarrage..."
sleep 5

# Vérifier que le processus tourne
if ps -p $BACKEND_PID > /dev/null 2>&1; then
    echo "✅ Le processus backend tourne"
    
    # Vérifier qu'il répond
    if curl -s http://localhost:8000/api/v1/docs > /dev/null 2>&1; then
        echo "✅ Le backend répond correctement"
        echo ""
        echo "🌐 Backend accessible sur:"
        echo "   - http://localhost:8000/api/v1/docs"
        echo "   - http://192.168.1.122:8000/api/v1 (depuis iPhone)"
        echo ""
        echo "📊 Voir les logs: tail -f backend_output.log"
        echo "🛑 Arrêter: kill \$(cat backend.pid)"
    else
        echo "⚠️  Le backend ne répond pas encore, patientez..."
        echo "📝 Vérifiez les logs: tail -f backend_output.log"
    fi
else
    echo "❌ Le backend ne démarre pas!"
    echo "📝 Logs d'erreur:"
    cat backend_output.log
    exit 1
fi

