#!/bin/bash
# Script pour lancer le backend en arrière-plan

cd "$(dirname "$0")"

# Arrêter les processus existants
pkill -f "uvicorn app.main" 2>/dev/null
sleep 1

# Lancer en arrière-plan avec logs
nohup python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > backend.log 2>&1 &

# Récupérer le PID
PID=$!
echo $PID > backend.pid

echo "✅ Backend démarré en arrière-plan (PID: $PID)"
echo "📝 Logs: backend/backend.log"
echo "🛑 Pour arrêter: kill \$(cat backend/backend.pid)"
echo ""
echo "Attendez 3 secondes..."
sleep 3

# Vérifier que ça a démarré
if ps -p $PID > /dev/null; then
    echo "✅ Backend fonctionne!"
    echo "🌐 http://localhost:8000/docs"
    tail -n 10 backend.log
else
    echo "❌ Erreur de démarrage. Voir backend.log"
    cat backend.log
fi

