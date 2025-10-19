#!/bin/bash
# Script pour arrêter le backend

cd "$(dirname "$0")"

echo "🛑 Arrêt du backend..."

# Méthode 1: Via PID file
if [ -f backend.pid ]; then
    PID=$(cat backend.pid)
    if ps -p $PID > /dev/null 2>&1; then
        kill $PID
        echo "✅ Processus $PID arrêté"
        rm backend.pid
    else
        echo "⚠️  Processus $PID n'existe plus"
        rm backend.pid
    fi
fi

# Méthode 2: Recherche par nom
PIDS=$(pgrep -f "uvicorn app.main")
if [ ! -z "$PIDS" ]; then
    echo "🔍 Processus uvicorn trouvés: $PIDS"
    pkill -f "uvicorn app.main"
    sleep 1
    echo "✅ Tous les processus uvicorn arrêtés"
else
    echo "✅ Aucun processus uvicorn trouvé"
fi

echo "✅ Backend arrêté"

