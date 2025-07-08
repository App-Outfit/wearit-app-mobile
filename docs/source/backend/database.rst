Base de données
==============

L'API WearIT utilise MongoDB comme base de données principale, offrant flexibilité et performance pour les données non structurées et semi-structurées.

Vue d'ensemble
--------------

MongoDB est choisi pour ses avantages dans le contexte de WearIT :

* **Flexibilité des schémas** : Adaptation facile aux évolutions
* **Performance** : Excellentes performances pour les requêtes de lecture
* **Scalabilité** : Horizontal scaling avec sharding
* **Support JSON natif** : Intégration naturelle avec les APIs REST
* **Indexation géospatiale** : Pour les fonctionnalités futures

Configuration
-------------

Connexion MongoDB
~~~~~~~~~~~~~~~~~

L'application utilise Motor (driver async pour MongoDB) :

.. code-block:: python

   from motor.motor_asyncio import AsyncIOMotorClient
   from app.core.config import settings

   class MongoDB:
       def __init__(self):
           self.client = None
           self.db = None
       
       async def connect(self, db_url: str, db_name: str):
           self.client = AsyncIOMotorClient(db_url)
           self.db = self.client[db_name]
           print(f"Connected to MongoDB: {db_name}")
       
       async def close(self):
           if self.client:
               self.client.close()
               print("MongoDB connection closed")

Variables d'environnement
~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   # MongoDB
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DATABASE=wearit
   
   # Pour la production
   MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net
   MONGODB_DATABASE_PROD=wearit_prod

Structure des collections
-------------------------

Users Collection
~~~~~~~~~~~~~~~~

Stockage des informations utilisateur :

.. code-block:: json

   {
     "_id": ObjectId("507f1f77bcf86cd799439011"),
     "email": "user@example.com",
     "password": "$2b$12$...",
     "name": "John Doe",
     "avatar_url": "https://s3.amazonaws.com/...",
     "created_at": ISODate("2024-01-01T00:00:00Z"),
     "updated_at": ISODate("2024-01-01T00:00:00Z"),
     "is_active": true,
     "email_verified": false
   }

Indexes :

.. code-block:: javascript

   db.users.createIndex({ "email": 1 }, { unique: true })
   db.users.createIndex({ "created_at": -1 })

Clothing Collection
~~~~~~~~~~~~~~~~~~~

Stockage des vêtements des utilisateurs :

.. code-block:: json

   {
     "_id": ObjectId("507f1f77bcf86cd799439014"),
     "user_id": ObjectId("507f1f77bcf86cd799439011"),
     "name": "T-shirt blanc",
     "category": "tops",
     "brand": "Nike",
     "image_url": "https://s3.amazonaws.com/...",
     "s3_key": "clothing/user_id/clothing_id.jpg",
     "created_at": ISODate("2024-01-01T00:00:00Z"),
     "updated_at": ISODate("2024-01-01T00:00:00Z")
   }

Indexes :

.. code-block:: javascript

   db.clothing.createIndex({ "user_id": 1 })
   db.clothing.createIndex({ "user_id": 1, "category": 1 })
   db.clothing.createIndex({ "user_id": 1, "brand": 1 })

Body Collection
~~~~~~~~~~~~~~~

Stockage des données corporelles des utilisateurs :

.. code-block:: json

   {
     "_id": ObjectId("507f1f77bcf86cd799439016"),
     "user_id": ObjectId("507f1f77bcf86cd799439011"),
     "height": 175,
     "weight": 70,
     "measurements": {
       "chest": 95,
       "waist": 80,
       "hips": 95,
       "shoulders": 45,
       "arms": 30
     },
     "image_url": "https://s3.amazonaws.com/...",
     "s3_key": "body/user_id/body_id.jpg",
     "created_at": ISODate("2024-01-01T00:00:00Z"),
     "updated_at": ISODate("2024-01-01T00:00:00Z")
   }

Indexes :

.. code-block:: javascript

   db.body.createIndex({ "user_id": 1 }, { unique: true })

Tryon Collection
~~~~~~~~~~~~~~~~

Stockage des résultats de Virtual Try-On :

.. code-block:: json

   {
     "_id": ObjectId("507f1f77bcf86cd799439013"),
     "user_id": ObjectId("507f1f77bcf86cd799439011"),
     "body_id": ObjectId("507f1f77bcf86cd799439016"),
     "clothing_id": ObjectId("507f1f77bcf86cd799439014"),
     "result_image_url": "https://s3.amazonaws.com/...",
     "s3_key": "tryon/user_id/tryon_id.jpg",
     "status": "completed",
     "processing_time": 15.5,
     "model_used": "replicate_model_ref",
     "created_at": ISODate("2024-01-01T00:00:00Z"),
     "completed_at": ISODate("2024-01-01T00:00:15Z")
   }

Indexes :

.. code-block:: javascript

   db.tryon.createIndex({ "user_id": 1 })
   db.tryon.createIndex({ "user_id": 1, "body_id": 1 })
   db.tryon.createIndex({ "user_id": 1, "status": 1 })
   db.tryon.createIndex({ "created_at": -1 })

Favorites Collection
~~~~~~~~~~~~~~~~~~~~

Stockage des favoris des utilisateurs :

.. code-block:: json

   {
     "_id": ObjectId("507f1f77bcf86cd799439015"),
     "user_id": ObjectId("507f1f77bcf86cd799439011"),
     "tryon_id": ObjectId("507f1f77bcf86cd799439013"),
     "created_at": ISODate("2024-01-01T00:00:00Z")
   }

Indexes :

.. code-block:: javascript

   db.favorites.createIndex({ "user_id": 1 })
   db.favorites.createIndex({ "user_id": 1, "tryon_id": 1 }, { unique: true })

Password Reset Collection
~~~~~~~~~~~~~~~~~~~~~~~~~

Stockage temporaire des codes de réinitialisation :

.. code-block:: json

   {
     "_id": ObjectId("507f1f77bcf86cd799439017"),
     "user_id": ObjectId("507f1f77bcf86cd799439011"),
     "code": "123456",
     "expires_at": ISODate("2024-01-01T00:10:00Z"),
     "created_at": ISODate("2024-01-01T00:00:00Z")
   }

Indexes :

.. code-block:: javascript

   db.password_reset.createIndex({ "user_id": 1 })
   db.password_reset.createIndex({ "expires_at": 1 }, { expireAfterSeconds: 0 })

Repository Pattern
------------------

Structure des repositories
~~~~~~~~~~~~~~~~~~~~~~~~~~

Chaque feature a son propre repository pour l'accès aux données :

.. code-block:: python

   class AuthRepository:
       def __init__(self, db: Database):
           self.db = db
           self.collection = db.users
       
       async def create_user(self, user_data: dict) -> User:
           result = await self.collection.insert_one(user_data)
           user_data["_id"] = result.inserted_id
           return User(**user_data)
       
       async def find_user_by_email(self, email: str) -> Optional[User]:
           user_data = await self.collection.find_one({"email": email})
           if user_data:
               return User(**user_data)
           return None
       
       async def find_user_by_id(self, user_id: str) -> Optional[User]:
           user_data = await self.collection.find_one({"_id": ObjectId(user_id)})
           if user_data:
               return User(**user_data)
           return None

Exemple de repository complet
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   class ClothingRepository:
       def __init__(self, db: Database):
           self.db = db
           self.collection = db.clothing
       
       async def create_clothing(self, clothing_data: dict) -> Clothing:
           result = await self.collection.insert_one(clothing_data)
           clothing_data["_id"] = result.inserted_id
           return Clothing(**clothing_data)
       
       async def get_user_clothing(self, user_id: str, 
                                 skip: int = 0, limit: int = 10,
                                 category: Optional[str] = None,
                                 brand: Optional[str] = None) -> List[Clothing]:
           filter_query = {"user_id": ObjectId(user_id)}
           
           if category:
               filter_query["category"] = category
           if brand:
               filter_query["brand"] = brand
           
           cursor = self.collection.find(filter_query).skip(skip).limit(limit)
           clothing_list = await cursor.to_list(length=limit)
           
           return [Clothing(**item) for item in clothing_list]
       
       async def get_clothing_by_id(self, clothing_id: str, user_id: str) -> Optional[Clothing]:
           clothing_data = await self.collection.find_one({
               "_id": ObjectId(clothing_id),
               "user_id": ObjectId(user_id)
           })
           if clothing_data:
               return Clothing(**clothing_data)
           return None
       
       async def update_clothing(self, clothing_id: str, user_id: str, 
                               update_data: dict) -> Optional[Clothing]:
           update_data["updated_at"] = datetime.utcnow()
           
           result = await self.collection.find_one_and_update(
               {"_id": ObjectId(clothing_id), "user_id": ObjectId(user_id)},
               {"$set": update_data},
               return_document=True
           )
           
           if result:
               return Clothing(**result)
           return None
       
       async def delete_clothing(self, clothing_id: str, user_id: str) -> bool:
           result = await self.collection.delete_one({
               "_id": ObjectId(clothing_id),
               "user_id": ObjectId(user_id)
           })
           return result.deleted_count > 0

Gestion des dépendances
-----------------------

Injection de dépendances
~~~~~~~~~~~~~~~~~~~~~~~~

FastAPI utilise l'injection de dépendances pour la configuration des repositories :

.. code-block:: python

   async def get_db():
       return MongoDB.db

   def get_clothing_repo(db = Depends(get_db)):
       return ClothingRepository(db)

   @router.get("/clothing", response_model=ClothingListResponse)
   async def get_user_clothing(
       current_user: User = Depends(get_current_user),
       repo: ClothingRepository = Depends(get_clothing_repo),
       skip: int = 0,
       limit: int = 10,
       category: Optional[str] = None,
       brand: Optional[str] = None
   ):
       clothing = await repo.get_user_clothing(
           current_user.id, skip, limit, category, brand
       )
       return ClothingListResponse(
           status="success",
           data={"clothing": clothing}
       )

Performance
-----------

Optimisations MongoDB
~~~~~~~~~~~~~~~~~~~~

* **Indexation** : Index sur les champs fréquemment utilisés
* **Projection** : Sélection des champs nécessaires uniquement
* **Pagination** : Utilisation de skip/limit pour les grandes collections
* **Aggregation** : Pipeline d'agrégation pour les requêtes complexes

Exemple d'optimisation
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   async def get_user_clothing_with_stats(self, user_id: str):
       pipeline = [
           {"$match": {"user_id": ObjectId(user_id)}},
           {"$group": {
               "_id": "$category",
               "count": {"$sum": 1},
               "items": {"$push": "$$ROOT"}
           }},
           {"$sort": {"count": -1}}
       ]
       
       cursor = self.collection.aggregate(pipeline)
       return await cursor.to_list(length=None)

Monitoring
----------

Logs de base de données
~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   import logging
   
   logger = logging.getLogger(__name__)
   
   async def create_clothing(self, clothing_data: dict) -> Clothing:
       try:
           result = await self.collection.insert_one(clothing_data)
           logger.info(f"Clothing created: {result.inserted_id}")
           clothing_data["_id"] = result.inserted_id
           return Clothing(**clothing_data)
       except Exception as e:
           logger.error(f"Error creating clothing: {e}")
           raise

Métriques de performance
~~~~~~~~~~~~~~~~~~~~~~~~

* **Temps de réponse** : Monitoring des requêtes lentes
* **Utilisation des index** : Vérification de l'efficacité des index
* **Taille des collections** : Surveillance de la croissance
* **Connexions actives** : Monitoring du pool de connexions

Backup et récupération
----------------------

Stratégie de backup
~~~~~~~~~~~~~~~~~~~

* **Backup automatique** : Sauvegarde quotidienne
* **Backup incrémental** : Sauvegarde des changements
* **Rétention** : Conservation des backups pendant 30 jours
* **Test de restauration** : Vérification mensuelle des backups

Exemple de script de backup
~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   #!/bin/bash
   
   # Configuration
   MONGODB_URI="mongodb://localhost:27017"
   BACKUP_DIR="/backups/mongodb"
   DATE=$(date +%Y%m%d_%H%M%S)
   
   # Création du backup
   mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/$DATE"
   
   # Compression
   tar -czf "$BACKUP_DIR/$DATE.tar.gz" -C "$BACKUP_DIR" "$DATE"
   
   # Nettoyage
   rm -rf "$BACKUP_DIR/$DATE"
   
   # Suppression des anciens backups (30 jours)
   find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete 