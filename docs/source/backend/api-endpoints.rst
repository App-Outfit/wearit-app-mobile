Endpoints API
=============

Cette section documente tous les endpoints de l'API WearIT, organisés par fonctionnalité.

Base URL
--------

Tous les endpoints sont préfixés par : ``/api/v1``

Authentification
----------------

Tous les endpoints d'authentification sont sous le préfixe : ``/api/v1/auth``

POST /auth/signup
~~~~~~~~~~~~~~~~~

Inscription d'un nouvel utilisateur.

**URL** : ``POST /api/v1/auth/signup``

**Body** :

.. code-block:: json

   {
     "email": "user@example.com",
     "password": "securepassword123",
     "name": "John Doe"
   }

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "message": "User created successfully",
     "data": {
       "user": {
         "id": "507f1f77bcf86cd799439011",
         "email": "user@example.com",
         "name": "John Doe",
         "created_at": "2024-01-01T00:00:00Z"
       },
       "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "token_type": "bearer"
     }
   }

**Codes d'erreur** :

* ``400`` : Données invalides
* ``409`` : Utilisateur déjà existant
* ``500`` : Erreur serveur

POST /auth/login
~~~~~~~~~~~~~~~~

Connexion d'un utilisateur.

**URL** : ``POST /api/v1/auth/login``

**Body** :

.. code-block:: json

   {
     "email": "user@example.com",
     "password": "securepassword123"
   }

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "message": "Login successful",
     "data": {
       "user": {
         "id": "507f1f77bcf86cd799439011",
         "email": "user@example.com",
         "name": "John Doe"
       },
       "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "token_type": "bearer"
     }
   }

**Codes d'erreur** :

* ``400`` : Données invalides
* ``401`` : Identifiants incorrects
* ``500`` : Erreur serveur

POST /auth/logout
~~~~~~~~~~~~~~~~~

Déconnexion de l'utilisateur.

**URL** : ``POST /api/v1/auth/logout``

**Headers** : ``Authorization: Bearer <token>``

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "message": "Logout successful"
   }

DELETE /auth/account
~~~~~~~~~~~~~~~~~~~~

Suppression du compte utilisateur.

**URL** : ``DELETE /api/v1/auth/account``

**Headers** : ``Authorization: Bearer <token>``

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "message": "Account deleted successfully"
   }

POST /auth/forgot-password
~~~~~~~~~~~~~~~~~~~~~~~~~~

Demande de réinitialisation de mot de passe.

**URL** : ``POST /api/v1/auth/forgot-password``

**Body** :

.. code-block:: json

   {
     "email": "user@example.com"
   }

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "message": "Password reset code sent to email"
   }

POST /auth/forgot-password/verify
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Vérification du code de réinitialisation.

**URL** : ``POST /api/v1/auth/forgot-password/verify``

**Body** :

.. code-block:: json

   {
     "email": "user@example.com",
     "code": "123456"
   }

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "message": "Code verified successfully"
   }

POST /auth/reset-password
~~~~~~~~~~~~~~~~~~~~~~~~~

Réinitialisation du mot de passe.

**URL** : ``POST /api/v1/auth/reset-password``

**Body** :

.. code-block:: json

   {
     "email": "user@example.com",
     "code": "123456",
     "new_password": "newsecurepassword123"
   }

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "message": "Password reset successfully"
   }

Virtual Try-On
--------------

Tous les endpoints de Virtual Try-On sont sous le préfixe : ``/api/v1/tryon``

WebSocket /tryon/ws
~~~~~~~~~~~~~~~~~~~

Connexion WebSocket pour les mises à jour en temps réel.

**URL** : ``WS /api/v1/tryon/ws``

**Headers** : ``Authorization: Bearer <token>``

**Utilisation** :

.. code-block:: javascript

   const ws = new WebSocket('ws://localhost:8000/api/v1/tryon/ws');
   ws.onmessage = (event) => {
     const data = JSON.parse(event.data);
     console.log('Try-on update:', data);
   };

POST /tryon
~~~~~~~~~~~

Création d'un nouveau try-on.

**URL** : ``POST /api/v1/tryon``

**Headers** : ``Authorization: Bearer <token>``

**Body** :

.. code-block:: json

   {
     "body_id": "507f1f77bcf86cd799439011",
     "clothing_id": "507f1f77bcf86cd799439012"
   }

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "message": "Try-on created successfully",
     "data": {
       "tryon": {
         "id": "507f1f77bcf86cd799439013",
         "body_id": "507f1f77bcf86cd799439011",
         "clothing_id": "507f1f77bcf86cd799439012",
         "result_image_url": "https://s3.amazonaws.com/...",
         "status": "processing",
         "created_at": "2024-01-01T00:00:00Z"
       }
     }
   }

GET /tryon
~~~~~~~~~~

Récupération de tous les try-ons de l'utilisateur.

**URL** : ``GET /api/v1/tryon``

**Headers** : ``Authorization: Bearer <token>``

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "data": {
       "tryons": [
         {
           "id": "507f1f77bcf86cd799439013",
           "body_id": "507f1f77bcf86cd799439011",
           "clothing_id": "507f1f77bcf86cd799439012",
           "result_image_url": "https://s3.amazonaws.com/...",
           "status": "completed",
           "created_at": "2024-01-01T00:00:00Z"
         }
       ]
     }
   }

GET /tryon/body/{body_id}
~~~~~~~~~~~~~~~~~~~~~~~~~

Récupération des try-ons pour un body spécifique.

**URL** : ``GET /api/v1/tryon/body/{body_id}``

**Headers** : ``Authorization: Bearer <token>``

**Paramètres** :

* ``body_id`` (string) : ID du body

**Réponse** : Même format que GET /tryon

GET /tryon/{tryon_id}
~~~~~~~~~~~~~~~~~~~~~

Récupération d'un try-on spécifique.

**URL** : ``GET /api/v1/tryon/{tryon_id}``

**Headers** : ``Authorization: Bearer <token>``

**Paramètres** :

* ``tryon_id`` (string) : ID du try-on

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "data": {
       "tryon": {
         "id": "507f1f77bcf86cd799439013",
         "body_id": "507f1f77bcf86cd799439011",
         "clothing_id": "507f1f77bcf86cd799439012",
         "result_image_url": "https://s3.amazonaws.com/...",
         "status": "completed",
         "created_at": "2024-01-01T00:00:00Z"
       }
     }
   }

DELETE /tryon/{tryon_id}
~~~~~~~~~~~~~~~~~~~~~~~~

Suppression d'un try-on.

**URL** : ``DELETE /api/v1/tryon/{tryon_id}``

**Headers** : ``Authorization: Bearer <token>``

**Paramètres** :

* ``tryon_id`` (string) : ID du try-on

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "message": "Try-on deleted successfully"
   }

Gestion des vêtements
---------------------

Tous les endpoints de gestion des vêtements sont sous le préfixe : ``/api/v1/clothing``

GET /clothing
~~~~~~~~~~~~~

Récupération de tous les vêtements de l'utilisateur.

**URL** : ``GET /api/v1/clothing``

**Headers** : ``Authorization: Bearer <token>``

**Paramètres de requête** :

* ``category`` (string, optionnel) : Filtrer par catégorie
* ``brand`` (string, optionnel) : Filtrer par marque
* ``limit`` (integer, optionnel) : Nombre maximum d'éléments
* ``offset`` (integer, optionnel) : Offset pour la pagination

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "data": {
       "clothing": [
         {
           "id": "507f1f77bcf86cd799439014",
           "name": "T-shirt blanc",
           "category": "tops",
           "brand": "Nike",
           "image_url": "https://s3.amazonaws.com/...",
           "created_at": "2024-01-01T00:00:00Z"
         }
       ],
       "total": 1,
       "limit": 10,
       "offset": 0
     }
   }

POST /clothing
~~~~~~~~~~~~~~

Ajout d'un nouveau vêtement.

**URL** : ``POST /api/v1/clothing``

**Headers** : ``Authorization: Bearer <token>``

**Body** (multipart/form-data) :

* ``image`` (file) : Image du vêtement
* ``name`` (string) : Nom du vêtement
* ``category`` (string) : Catégorie
* ``brand`` (string, optionnel) : Marque

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "message": "Clothing added successfully",
     "data": {
       "clothing": {
         "id": "507f1f77bcf86cd799439014",
         "name": "T-shirt blanc",
         "category": "tops",
         "brand": "Nike",
         "image_url": "https://s3.amazonaws.com/...",
         "created_at": "2024-01-01T00:00:00Z"
       }
     }
   }

PUT /clothing/{clothing_id}
~~~~~~~~~~~~~~~~~~~~~~~~~~

Mise à jour d'un vêtement.

**URL** : ``PUT /api/v1/clothing/{clothing_id}``

**Headers** : ``Authorization: Bearer <token>``

**Paramètres** :

* ``clothing_id`` (string) : ID du vêtement

**Body** :

.. code-block:: json

   {
     "name": "T-shirt blanc mis à jour",
     "category": "tops",
     "brand": "Adidas"
   }

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "message": "Clothing updated successfully",
     "data": {
       "clothing": {
         "id": "507f1f77bcf86cd799439014",
         "name": "T-shirt blanc mis à jour",
         "category": "tops",
         "brand": "Adidas",
         "image_url": "https://s3.amazonaws.com/...",
         "updated_at": "2024-01-01T00:00:00Z"
       }
     }
   }

DELETE /clothing/{clothing_id}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Suppression d'un vêtement.

**URL** : ``DELETE /api/v1/clothing/{clothing_id}``

**Headers** : ``Authorization: Bearer <token>``

**Paramètres** :

* ``clothing_id`` (string) : ID du vêtement

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "message": "Clothing deleted successfully"
   }

Gestion des utilisateurs
------------------------

Tous les endpoints de gestion des utilisateurs sont sous le préfixe : ``/api/v1/users``

GET /users/me
~~~~~~~~~~~~~

Récupération du profil utilisateur actuel.

**URL** : ``GET /api/v1/users/me``

**Headers** : ``Authorization: Bearer <token>``

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "data": {
       "user": {
         "id": "507f1f77bcf86cd799439011",
         "email": "user@example.com",
         "name": "John Doe",
         "avatar_url": "https://s3.amazonaws.com/...",
         "created_at": "2024-01-01T00:00:00Z",
         "updated_at": "2024-01-01T00:00:00Z"
       }
     }
   }

PUT /users/me
~~~~~~~~~~~~~

Mise à jour du profil utilisateur.

**URL** : ``PUT /api/v1/users/me``

**Headers** : ``Authorization: Bearer <token>``

**Body** :

.. code-block:: json

   {
     "name": "John Doe Updated",
     "avatar_url": "https://s3.amazonaws.com/..."
   }

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "message": "Profile updated successfully",
     "data": {
       "user": {
         "id": "507f1f77bcf86cd799439011",
         "email": "user@example.com",
         "name": "John Doe Updated",
         "avatar_url": "https://s3.amazonaws.com/...",
         "updated_at": "2024-01-01T00:00:00Z"
       }
     }
   }

Système de favoris
------------------

Tous les endpoints de favoris sont sous le préfixe : ``/api/v1/favorites``

GET /favorites
~~~~~~~~~~~~~~

Récupération des favoris de l'utilisateur.

**URL** : ``GET /api/v1/favorites``

**Headers** : ``Authorization: Bearer <token>``

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "data": {
       "favorites": [
         {
           "id": "507f1f77bcf86cd799439015",
           "tryon_id": "507f1f77bcf86cd799439013",
           "created_at": "2024-01-01T00:00:00Z"
         }
       ]
     }
   }

POST /favorites
~~~~~~~~~~~~~~~

Ajout d'un try-on aux favoris.

**URL** : ``POST /api/v1/favorites``

**Headers** : ``Authorization: Bearer <token>``

**Body** :

.. code-block:: json

   {
     "tryon_id": "507f1f77bcf86cd799439013"
   }

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "message": "Favorite added successfully",
     "data": {
       "favorite": {
         "id": "507f1f77bcf86cd799439015",
         "tryon_id": "507f1f77bcf86cd799439013",
         "created_at": "2024-01-01T00:00:00Z"
       }
     }
   }

DELETE /favorites/{favorite_id}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Suppression d'un favori.

**URL** : ``DELETE /api/v1/favorites/{favorite_id}``

**Headers** : ``Authorization: Bearer <token>``

**Paramètres** :

* ``favorite_id`` (string) : ID du favori

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "message": "Favorite removed successfully"
   }

Gestion des données corporelles
-------------------------------

Tous les endpoints de gestion des données corporelles sont sous le préfixe : ``/api/v1/body``

GET /body
~~~~~~~~~

Récupération des données corporelles de l'utilisateur.

**URL** : ``GET /api/v1/body``

**Headers** : ``Authorization: Bearer <token>``

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "data": {
       "body": {
         "id": "507f1f77bcf86cd799439016",
         "height": 175,
         "weight": 70,
         "measurements": {
           "chest": 95,
           "waist": 80,
           "hips": 95
         },
         "image_url": "https://s3.amazonaws.com/...",
         "created_at": "2024-01-01T00:00:00Z"
       }
     }
   }

POST /body
~~~~~~~~~~

Création ou mise à jour des données corporelles.

**URL** : ``POST /api/v1/body``

**Headers** : ``Authorization: Bearer <token>``

**Body** (multipart/form-data) :

* ``image`` (file) : Image du body
* ``height`` (integer) : Taille en cm
* ``weight`` (integer) : Poids en kg
* ``measurements`` (json) : Mesures corporelles

**Réponse** :

.. code-block:: json

   {
     "status": "success",
     "message": "Body data saved successfully",
     "data": {
       "body": {
         "id": "507f1f77bcf86cd799439016",
         "height": 175,
         "weight": 70,
         "measurements": {
           "chest": 95,
           "waist": 80,
           "hips": 95
         },
         "image_url": "https://s3.amazonaws.com/...",
         "created_at": "2024-01-01T00:00:00Z"
       }
     }
   }

Codes d'erreur globaux
----------------------

Tous les endpoints peuvent retourner les erreurs suivantes :

* ``400 Bad Request`` : Données invalides ou manquantes
* ``401 Unauthorized`` : Token manquant ou invalide
* ``403 Forbidden`` : Accès refusé
* ``404 Not Found`` : Ressource non trouvée
* ``409 Conflict`` : Conflit de données
* ``422 Unprocessable Entity`` : Erreur de validation
* ``500 Internal Server Error`` : Erreur serveur

Format d'erreur
~~~~~~~~~~~~~~~

.. code-block:: json

   {
     "error": "Description de l'erreur",
     "detail": "Détails supplémentaires (optionnel)",
     "status_code": 400
   } 