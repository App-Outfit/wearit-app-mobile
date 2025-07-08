WearIT Backend API
==================

Bienvenue dans la documentation de l'API backend WearIT, développée avec FastAPI et Python. Cette API fournit tous les services nécessaires pour l'application mobile WearIT, incluant l'authentification, le Virtual Try-On, la gestion des vêtements et plus encore.

.. toctree::
   :maxdepth: 2
   :caption: Table des matières:

   architecture
   api-endpoints
   authentication
   database
   storage
   deployment

Vue d'ensemble
--------------

Le backend WearIT est une API REST moderne construite avec FastAPI qui gère l'ensemble des fonctionnalités de l'application mobile :

* **Authentification sécurisée** avec JWT et OAuth2
* **Virtual Try-On** avec génération d'images par IA
* **Gestion des vêtements** et upload de fichiers
* **Système de favoris** et exploration
* **Paiements** avec Stripe
* **Stockage cloud** avec AWS S3

Technologies utilisées
----------------------

* **FastAPI** - Framework web moderne et rapide avec documentation automatique
* **MongoDB** - Base de données NoSQL pour la flexibilité des données
* **JWT** - Authentification par tokens sécurisée
* **AWS S3** - Stockage de fichiers et images
* **Stripe** - Gestion des paiements
* **Replicate** - API d'IA pour le Virtual Try-On
* **Pydantic** - Validation de données et sérialisation
* **WebSockets** - Communication en temps réel

Architecture générale
--------------------

L'API suit une architecture modulaire avec séparation claire des responsabilités :

.. code-block:: text

   backend/
   ├── app/
   │   ├── core/              # Configuration et utilitaires
   │   │   ├── config.py      # Paramètres de l'application
   │   │   ├── errors.py      # Gestion d'erreurs
   │   │   └── exception_handler.py
   │   ├── features/          # Fonctionnalités par domaine
   │   │   ├── auth/         # Authentification
   │   │   ├── user/         # Gestion utilisateurs
   │   │   ├── body/         # Données corporelles
   │   │   ├── clothing/     # Gestion vêtements
   │   │   ├── tryon/        # Virtual Try-On
   │   │   ├── favorite/     # Système de favoris
   │   │   ├── payment/      # Gestion des paiements
   │   │   └── explorer/     # Exploration et découverte
   │   ├── infrastructure/    # Base de données et stockage
   │   │   ├── database/     # Configuration MongoDB
   │   │   └── storage/      # Client AWS S3
   │   └── main.py           # Point d'entrée FastAPI
   └── tests/                # Tests automatisés

Configuration
-------------

L'application utilise un système de configuration centralisé via des variables d'environnement :

.. code-block:: python

   class Settings:
       PROJECT_NAME: str = "WearIT API"
       PROJECT_VERSION: str = "0.1.0"
       API_V1_STR: str = "/api/v1"
       
       # Authentification
       JWT_SECRET_KEY: str
       JWT_ALGORITHM: str
       JWT_EXPIRE_MINUTES: int = 60
       
       # Base de données
       MONGODB_URI: str
       MONGODB_DB: str
       
       # Stockage AWS S3
       AWS_REGION_NAME: str
       AWS_BUCKET_NAME: str
       AWS_ACCESS_KEY_ID: str
       AWS_SECRET_ACCESS_KEY: str
       
       # Paiements Stripe
       STRIPE_PUBLIC_KEY: str
       STRIPE_SECRET_KEY: str
       
       # IA Replicate
       REPLICATE_API_TOKEN: str
       REPLICATE_MODEL_REF: str

Sécurité
---------

* **JWT Tokens** : Authentification sécurisée avec expiration
* **CORS** : Configuration pour l'application mobile
* **Validation stricte** : Toutes les données sont validées avec Pydantic
* **Gestion d'erreurs** : Système centralisé de gestion des exceptions
* **Rate Limiting** : Protection contre les abus (à implémenter)

Tests
------

* **Tests unitaires** : Couverture complète des services
* **Tests d'intégration** : Tests des endpoints API
* **Tests de performance** : Tests de charge et de mémoire
* **Tests de sécurité** : Validation des mécanismes d'authentification

Déploiement
-----------

L'API peut être déployée via :

* **Docker** : Containerisation complète
* **Cloud** : AWS, Google Cloud, Azure
* **Serverless** : Vercel, Netlify Functions 