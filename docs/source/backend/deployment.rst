Déploiement
===========

Ce guide explique comment déployer l'API WearIT en production avec différentes options d'hébergement.

Vue d'ensemble
--------------

L'API WearIT peut être déployée via plusieurs méthodes :

* **Docker** : Containerisation complète
* **Cloud Platforms** : AWS, Google Cloud, Azure
* **Serverless** : Vercel, Netlify Functions
* **VPS** : Serveur virtuel privé

Déploiement avec Docker
-----------------------

Dockerfile
~~~~~~~~~~

.. code-block:: dockerfile

   # Utilisation de Python 3.11 slim
   FROM python:3.11-slim
   
   # Définition du répertoire de travail
   WORKDIR /app
   
   # Installation des dépendances système
   RUN apt-get update && apt-get install -y \
       gcc \
       && rm -rf /var/lib/apt/lists/*
   
   # Copie des fichiers de dépendances
   COPY requirements.txt .
   
   # Installation des dépendances Python
   RUN pip install --no-cache-dir -r requirements.txt
   
   # Copie du code source
   COPY . .
   
   # Exposition du port
   EXPOSE 8000
   
   # Commande de démarrage
   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

Docker Compose
~~~~~~~~~~~~~~

Configuration complète avec MongoDB :

.. code-block:: yaml

   version: '3.8'
   
   services:
     api:
       build: .
       ports:
         - "8000:8000"
       environment:
         - MONGODB_URI=mongodb://mongodb:27017
         - MONGODB_DATABASE=wearit
         - JWT_SECRET_KEY=your-secret-key
         - AWS_REGION_NAME=us-east-1
         - AWS_BUCKET_NAME=wearit-storage
         - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
         - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
       depends_on:
         - mongodb
       volumes:
         - ./logs:/app/logs
   
     mongodb:
       image: mongo:6.0
       ports:
         - "27017:27017"
       environment:
         - MONGO_INITDB_DATABASE=wearit
       volumes:
         - mongodb_data:/data/db
   
     nginx:
       image: nginx:alpine
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf
         - ./ssl:/etc/nginx/ssl
       depends_on:
         - api
   
   volumes:
     mongodb_data:

Nginx Configuration
~~~~~~~~~~~~~~~~~~~

Configuration reverse proxy :

.. code-block:: nginx

   events {
       worker_connections 1024;
   }
   
   http {
       upstream api {
           server api:8000;
       }
   
       server {
           listen 80;
           server_name your-domain.com;
           
           # Redirection HTTPS
           return 301 https://$server_name$request_uri;
       }
   
       server {
           listen 443 ssl http2;
           server_name your-domain.com;
   
           ssl_certificate /etc/nginx/ssl/cert.pem;
           ssl_certificate_key /etc/nginx/ssl/key.pem;
   
           # Configuration SSL
           ssl_protocols TLSv1.2 TLSv1.3;
           ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
           ssl_prefer_server_ciphers off;
   
           # Headers de sécurité
           add_header X-Frame-Options DENY;
           add_header X-Content-Type-Options nosniff;
           add_header X-XSS-Protection "1; mode=block";
   
           location / {
               proxy_pass http://api;
               proxy_set_header Host $host;
               proxy_set_header X-Real-IP $remote_addr;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
               proxy_set_header X-Forwarded-Proto $scheme;
               
               # Timeouts
               proxy_connect_timeout 60s;
               proxy_send_timeout 60s;
               proxy_read_timeout 60s;
           }
       }
   }

Déploiement Cloud
-----------------

AWS (EC2 + RDS)
~~~~~~~~~~~~~~~

1. **Création d'une instance EC2** :

.. code-block:: bash

   # Installation des dépendances
   sudo apt-get update
   sudo apt-get install -y python3 python3-pip nginx
   
   # Installation de Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER

2. **Configuration de l'application** :

.. code-block:: bash

   # Clonage du repository
   git clone https://github.com/your-repo/wearit-app-mobile.git
   cd wearit-app-mobile/backend
   
   # Configuration des variables d'environnement
   cp .env.example .env
   nano .env

3. **Démarrage avec Docker Compose** :

.. code-block:: bash

   docker-compose up -d

Google Cloud (Cloud Run)
~~~~~~~~~~~~~~~~~~~~~~~~

1. **Configuration du projet** :

.. code-block:: bash

   # Installation du SDK Google Cloud
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   
   # Configuration du projet
   gcloud config set project your-project-id
   gcloud auth login

2. **Build et déploiement** :

.. code-block:: bash

   # Build de l'image
   gcloud builds submit --tag gcr.io/your-project-id/wearit-api
   
   # Déploiement sur Cloud Run
   gcloud run deploy wearit-api \
     --image gcr.io/your-project-id/wearit-api \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars MONGODB_URI=your-mongodb-uri

Azure (App Service)
~~~~~~~~~~~~~~~~~~~

1. **Configuration Azure CLI** :

.. code-block:: bash

   # Installation d'Azure CLI
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   
   # Connexion
   az login

2. **Création de l'App Service** :

.. code-block:: bash

   # Création du groupe de ressources
   az group create --name wearit-rg --location eastus
   
   # Création du plan App Service
   az appservice plan create --name wearit-plan --resource-group wearit-rg --sku B1
   
   # Création de l'application web
   az webapp create --name wearit-api --resource-group wearit-rg --plan wearit-plan --runtime "PYTHON|3.11"

3. **Déploiement** :

.. code-block:: bash

   # Configuration des variables d'environnement
   az webapp config appsettings set --name wearit-api --resource-group wearit-rg --settings MONGODB_URI=your-mongodb-uri
   
   # Déploiement du code
   az webapp deployment source config-local-git --name wearit-api --resource-group wearit-rg
   git remote add azure https://username@wearit-api.scm.azurewebsites.net/wearit-api.git
   git push azure main

Déploiement Serverless
----------------------

Vercel
~~~~~~

1. **Configuration Vercel** :

.. code-block:: json

   {
     "version": 2,
     "builds": [
       {
         "src": "app/main.py",
         "use": "@vercel/python"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "app/main.py"
       }
     ],
     "env": {
       "MONGODB_URI": "@mongodb-uri",
       "JWT_SECRET_KEY": "@jwt-secret-key"
     }
   }

2. **Déploiement** :

.. code-block:: bash

   # Installation de Vercel CLI
   npm i -g vercel
   
   # Déploiement
   vercel --prod

Netlify Functions
~~~~~~~~~~~~~~~~~

1. **Configuration Netlify** :

.. code-block:: toml

   [build]
     functions = "functions"
     publish = "public"
   
   [build.environment]
     PYTHON_VERSION = "3.11"
   
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/api/:splat"
     status = 200

2. **Structure des fonctions** :

.. code-block:: python

   # functions/api.py
   from http.server import BaseHTTPRequestHandler
   from app.main import app
   import json

   class handler(BaseHTTPRequestHandler):
       def do_GET(self):
           # Logique de routage
           pass
       
       def do_POST(self):
           # Logique de routage
           pass

Variables d'environnement
------------------------

Configuration de production
~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   # Base de données
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wearit
   MONGODB_DATABASE=wearit_prod
   
   # Authentification
   JWT_SECRET_KEY=your-super-secret-key-here
   JWT_ALGORITHM=HS256
   JWT_EXPIRE_MINUTES=60
   
   # AWS S3
   AWS_REGION_NAME=us-east-1
   AWS_BUCKET_NAME=wearit-storage-prod
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   
   # Email
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_FROM_EMAIL=noreply@wearit.com
   
   # Stripe
   STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   # IA Replicate
   REPLICATE_API_TOKEN=r8_...
   REPLICATE_MODEL_REF=your-model-ref
   REPLICATE_BODY_REF=your-body-ref
   
   # CORS
   CORS_ORIGINS=["https://your-app-domain.com", "https://your-admin-domain.com"]

Gestion des secrets
~~~~~~~~~~~~~~~~~~~

Utilisation de gestionnaires de secrets :

.. code-block:: bash

   # AWS Secrets Manager
   aws secretsmanager create-secret --name wearit-api-secrets --secret-string '{"JWT_SECRET_KEY":"your-secret","MONGODB_URI":"your-uri"}'
   
   # Google Secret Manager
   echo -n "your-secret" | gcloud secrets create jwt-secret-key --data-file=-
   
   # Azure Key Vault
   az keyvault secret set --vault-name wearit-vault --name jwt-secret-key --value "your-secret"

Monitoring et logs
------------------

Logs structurés
~~~~~~~~~~~~~~~

Configuration des logs en production :

.. code-block:: python

   import logging
   import json
   from datetime import datetime

   class JSONFormatter(logging.Formatter):
       def format(self, record):
           log_entry = {
               "timestamp": datetime.utcnow().isoformat(),
               "level": record.levelname,
               "message": record.getMessage(),
               "module": record.module,
               "function": record.funcName,
               "line": record.lineno
           }
           
           if hasattr(record, 'user_id'):
               log_entry['user_id'] = record.user_id
           
           if hasattr(record, 'request_id'):
               log_entry['request_id'] = record.request_id
           
           return json.dumps(log_entry)

   # Configuration du logger
   logging.basicConfig(
       level=logging.INFO,
       format='%(message)s',
       handlers=[logging.StreamHandler()]
   )
   
   logger = logging.getLogger(__name__)
   logger.handlers[0].setFormatter(JSONFormatter())

Métriques de performance
~~~~~~~~~~~~~~~~~~~~~~~~

Monitoring des performances :

.. code-block:: python

   import time
   from functools import wraps

   def monitor_performance(func):
       @wraps(func)
       async def wrapper(*args, **kwargs):
           start_time = time.time()
           try:
               result = await func(*args, **kwargs)
               duration = time.time() - start_time
               logger.info(f"Function {func.__name__} completed in {duration:.2f}s")
               return result
           except Exception as e:
               duration = time.time() - start_time
               logger.error(f"Function {func.__name__} failed after {duration:.2f}s: {e}")
               raise
       return wrapper

Health Checks
~~~~~~~~~~~~~

Endpoint de vérification de santé :

.. code-block:: python

   @router.get("/health")
   async def health_check():
       try:
           # Vérification de la base de données
           await MongoDB.db.command('ping')
           
           # Vérification de S3
           await S3Client.s3_client.head_bucket(Bucket=S3Client.bucket_name)
           
           return {
               "status": "healthy",
               "timestamp": datetime.utcnow().isoformat(),
               "services": {
                   "database": "ok",
                   "storage": "ok"
               }
           }
       except Exception as e:
           return JSONResponse(
               status_code=503,
               content={
                   "status": "unhealthy",
                   "error": str(e),
                   "timestamp": datetime.utcnow().isoformat()
               }
           )

Sécurité
--------

Configuration SSL/TLS
~~~~~~~~~~~~~~~~~~~~~

Certificats SSL avec Let's Encrypt :

.. code-block:: bash

   # Installation de Certbot
   sudo apt-get install certbot python3-certbot-nginx
   
   # Obtention du certificat
   sudo certbot --nginx -d your-domain.com
   
   # Renouvellement automatique
   sudo crontab -e
   # Ajouter : 0 12 * * * /usr/bin/certbot renew --quiet

Headers de sécurité
~~~~~~~~~~~~~~~~~~~

Configuration des headers de sécurité :

.. code-block:: python

   from fastapi.middleware.trustedhost import TrustedHostMiddleware
   from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

   # Middleware de sécurité
   app.add_middleware(TrustedHostMiddleware, allowed_hosts=["your-domain.com"])
   app.add_middleware(HTTPSRedirectMiddleware)

   @app.middleware("http")
   async def add_security_headers(request: Request, call_next):
       response = await call_next(request)
       response.headers["X-Content-Type-Options"] = "nosniff"
       response.headers["X-Frame-Options"] = "DENY"
       response.headers["X-XSS-Protection"] = "1; mode=block"
       response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
       return response

Backup et récupération
----------------------

Stratégie de backup
~~~~~~~~~~~~~~~~~~~

1. **Base de données** : Backup quotidien de MongoDB
2. **Fichiers S3** : Versioning activé
3. **Configuration** : Sauvegarde des variables d'environnement
4. **Code** : Versioning Git

Script de backup automatisé
~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   #!/bin/bash
   
   # Configuration
   BACKUP_DIR="/backups"
   DATE=$(date +%Y%m%d_%H%M%S)
   
   # Backup MongoDB
   mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/mongodb_$DATE"
   
   # Backup des variables d'environnement
   cp .env "$BACKUP_DIR/env_$DATE"
   
   # Compression
   tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" -C "$BACKUP_DIR" "mongodb_$DATE" "env_$DATE"
   
   # Nettoyage
   rm -rf "$BACKUP_DIR/mongodb_$DATE" "$BACKUP_DIR/env_$DATE"
   
   # Suppression des anciens backups (30 jours)
   find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +30 -delete 