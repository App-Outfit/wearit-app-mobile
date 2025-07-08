Stockage AWS S3
==============

L'API WearIT utilise AWS S3 pour le stockage des fichiers et images, offrant une solution scalable et fiable pour la gestion des assets.

Vue d'ensemble
--------------

AWS S3 est utilisé pour stocker :

* **Images de vêtements** : Photos des articles de la garde-robe
* **Images corporelles** : Photos des utilisateurs pour le VTO
* **Résultats VTO** : Images générées par l'IA
* **Avatars utilisateurs** : Photos de profil
* **Fichiers temporaires** : Uploads en cours de traitement

Configuration
-------------

Client S3
~~~~~~~~~

L'application utilise boto3 pour interagir avec AWS S3 :

.. code-block:: python

   import boto3
   from app.core.config import settings

   class S3Client:
       def __init__(self):
           self.s3_client = None
           self.bucket_name = None
       
       async def connect(self, region: str, bucket_name: str, 
                        access_key: str, secret_key: str):
           self.s3_client = boto3.client(
               's3',
               region_name=region,
               aws_access_key_id=access_key,
               aws_secret_access_key=secret_key
           )
           self.bucket_name = bucket_name
           print(f"Connected to S3 bucket: {bucket_name}")
       
       async def close(self):
           if self.s3_client:
               self.s3_client.close()
               print("S3 connection closed")

Variables d'environnement
~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   # AWS S3
   AWS_REGION_NAME=us-east-1
   AWS_BUCKET_NAME=wearit-storage
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   
   # Pour différents environnements
   AWS_BUCKET_NAME_DEV=wearit-storage-dev
   AWS_BUCKET_NAME_PROD=wearit-storage-prod

Structure des dossiers
----------------------

Organisation des fichiers
~~~~~~~~~~~~~~~~~~~~~~~~~

Les fichiers sont organisés de manière hiérarchique dans S3 :

.. code-block:: text

   wearit-storage/
   ├── clothing/
   │   └── {user_id}/
   │       ├── {clothing_id}.jpg
   │       └── {clothing_id}_thumb.jpg
   ├── body/
   │   └── {user_id}/
   │       └── {body_id}.jpg
   ├── tryon/
   │   └── {user_id}/
   │       └── {tryon_id}.jpg
   ├── avatars/
   │   └── {user_id}/
   │       └── avatar.jpg
   └── temp/
       └── {session_id}/
           └── {file_id}.tmp

Génération des chemins
~~~~~~~~~~~~~~~~~~~~~~

Le système utilise un builder de chemins pour organiser les fichiers :

.. code-block:: python

   class StoragePathBuilder:
       @staticmethod
       def clothing_path(user_id: str, clothing_id: str, filename: str) -> str:
           return f"clothing/{user_id}/{clothing_id}/{filename}"
       
       @staticmethod
       def body_path(user_id: str, body_id: str, filename: str) -> str:
           return f"body/{user_id}/{body_id}/{filename}"
       
       @staticmethod
       def tryon_path(user_id: str, tryon_id: str, filename: str) -> str:
           return f"tryon/{user_id}/{tryon_id}/{filename}"
       
       @staticmethod
       def avatar_path(user_id: str, filename: str) -> str:
           return f"avatars/{user_id}/{filename}"
       
       @staticmethod
       def temp_path(session_id: str, filename: str) -> str:
           return f"temp/{session_id}/{filename}"

Opérations de base
------------------

Upload de fichiers
~~~~~~~~~~~~~~~~~~

Upload d'un fichier vers S3 :

.. code-block:: python

   async def upload_file(self, file_data: bytes, s3_key: str, 
                        content_type: str = "image/jpeg") -> str:
       try:
           self.s3_client.put_object(
               Bucket=self.bucket_name,
               Key=s3_key,
               Body=file_data,
               ContentType=content_type,
               ACL='private'
           )
           
           # Génération de l'URL signée pour accès temporaire
           url = self.s3_client.generate_presigned_url(
               'get_object',
               Params={'Bucket': self.bucket_name, 'Key': s3_key},
               ExpiresIn=3600  # 1 heure
           )
           
           return url
       except Exception as e:
           raise AppError(f"Failed to upload file: {str(e)}", 500)

Download de fichiers
~~~~~~~~~~~~~~~~~~~~

Récupération d'un fichier depuis S3 :

.. code-block:: python

   async def download_file(self, s3_key: str) -> bytes:
       try:
           response = self.s3_client.get_object(
               Bucket=self.bucket_name,
               Key=s3_key
           )
           return response['Body'].read()
       except Exception as e:
           raise AppError(f"Failed to download file: {str(e)}", 500)

Suppression de fichiers
~~~~~~~~~~~~~~~~~~~~~~~

Suppression d'un fichier de S3 :

.. code-block:: python

   async def delete_file(self, s3_key: str) -> bool:
       try:
           self.s3_client.delete_object(
               Bucket=self.bucket_name,
               Key=s3_key
           )
           return True
       except Exception as e:
           logger.error(f"Failed to delete file {s3_key}: {e}")
           return False

Repository de stockage
---------------------

Interface unifiée
~~~~~~~~~~~~~~~~~

Le StorageRepository fournit une interface unifiée pour toutes les opérations de stockage :

.. code-block:: python

   class StorageRepository:
       def __init__(self):
           self.s3_client = S3Client()
           self.path_builder = StoragePathBuilder()
       
       async def upload_clothing_image(self, user_id: str, clothing_id: str, 
                                     file_data: bytes, filename: str) -> str:
           s3_key = self.path_builder.clothing_path(user_id, clothing_id, filename)
           return await self.s3_client.upload_file(file_data, s3_key)
       
       async def upload_body_image(self, user_id: str, body_id: str, 
                                 file_data: bytes, filename: str) -> str:
           s3_key = self.path_builder.body_path(user_id, body_id, filename)
           return await self.s3_client.upload_file(file_data, s3_key)
       
       async def upload_tryon_result(self, user_id: str, tryon_id: str, 
                                   file_data: bytes, filename: str) -> str:
           s3_key = self.path_builder.tryon_path(user_id, tryon_id, filename)
           return await self.s3_client.upload_file(file_data, s3_key)
       
       async def upload_avatar(self, user_id: str, file_data: bytes, 
                             filename: str) -> str:
           s3_key = self.path_builder.avatar_path(user_id, filename)
           return await self.s3_client.upload_file(file_data, s3_key)
       
       async def delete_user_files(self, user_id: str) -> bool:
           """Supprime tous les fichiers d'un utilisateur"""
           try:
               # Suppression des vêtements
               clothing_prefix = f"clothing/{user_id}/"
               self._delete_objects_with_prefix(clothing_prefix)
               
               # Suppression des images corporelles
               body_prefix = f"body/{user_id}/"
               self._delete_objects_with_prefix(body_prefix)
               
               # Suppression des try-ons
               tryon_prefix = f"tryon/{user_id}/"
               self._delete_objects_with_prefix(tryon_prefix)
               
               # Suppression de l'avatar
               avatar_prefix = f"avatars/{user_id}/"
               self._delete_objects_with_prefix(avatar_prefix)
               
               return True
           except Exception as e:
               logger.error(f"Failed to delete user files: {e}")
               return False
       
       def _delete_objects_with_prefix(self, prefix: str):
           """Supprime tous les objets avec un préfixe donné"""
           paginator = self.s3_client.get_paginator('list_objects_v2')
           pages = paginator.paginate(Bucket=self.bucket_name, Prefix=prefix)
           
           for page in pages:
               if 'Contents' in page:
                   objects = [{'Key': obj['Key']} for obj in page['Contents']]
                   self.s3_client.delete_objects(
                       Bucket=self.bucket_name,
                       Delete={'Objects': objects}
                   )

Optimisation des images
----------------------

Redimensionnement
~~~~~~~~~~~~~~~~~

Les images sont automatiquement redimensionnées avant stockage :

.. code-block:: python

   from PIL import Image
   import io

   class ImageProcessor:
       @staticmethod
       def resize_image(image_data: bytes, max_size: tuple = (800, 800)) -> bytes:
           """Redimensionne une image en conservant les proportions"""
           image = Image.open(io.BytesIO(image_data))
           
           # Conversion en RGB si nécessaire
           if image.mode != 'RGB':
               image = image.convert('RGB')
           
           # Redimensionnement
           image.thumbnail(max_size, Image.Resampling.LANCZOS)
           
           # Sauvegarde en JPEG
           output = io.BytesIO()
           image.save(output, format='JPEG', quality=85, optimize=True)
           return output.getvalue()
       
       @staticmethod
       def create_thumbnail(image_data: bytes, size: tuple = (200, 200)) -> bytes:
           """Crée une miniature d'une image"""
           image = Image.open(io.BytesIO(image_data))
           
           if image.mode != 'RGB':
               image = image.convert('RGB')
           
           # Redimensionnement avec crop centré
           image.thumbnail(size, Image.Resampling.LANCZOS)
           
           output = io.BytesIO()
           image.save(output, format='JPEG', quality=80, optimize=True)
           return output.getvalue()

Compression
~~~~~~~~~~~

Optimisation de la taille des fichiers :

.. code-block:: python

   async def upload_optimized_image(self, file_data: bytes, s3_key: str) -> str:
       # Redimensionnement
       optimized_data = ImageProcessor.resize_image(file_data)
       
       # Upload
       return await self.s3_client.upload_file(optimized_data, s3_key)

Sécurité
--------

Contrôle d'accès
~~~~~~~~~~~~~~~~

* **ACL privé** : Tous les fichiers sont privés par défaut
* **URLs signées** : Accès temporaire via URLs signées
* **IAM Policies** : Contrôle granulaire des permissions
* **CORS** : Configuration pour l'accès depuis l'application mobile

Configuration CORS
~~~~~~~~~~~~~~~~~~

.. code-block:: json

   {
     "CORSRules": [
       {
         "AllowedHeaders": ["*"],
         "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
         "AllowedOrigins": ["https://your-app-domain.com"],
         "ExposeHeaders": ["ETag"],
         "MaxAgeSeconds": 3000
       }
     ]
   }

URLs signées
~~~~~~~~~~~~

Génération d'URLs temporaires pour l'accès sécurisé :

.. code-block:: python

   def generate_presigned_url(self, s3_key: str, expires_in: int = 3600) -> str:
       """Génère une URL signée pour accéder à un fichier"""
       try:
           url = self.s3_client.generate_presigned_url(
               'get_object',
               Params={'Bucket': self.bucket_name, 'Key': s3_key},
               ExpiresIn=expires_in
           )
           return url
       except Exception as e:
           logger.error(f"Failed to generate presigned URL: {e}")
           return None

Monitoring
----------

Métriques S3
~~~~~~~~~~~~

* **Taille des fichiers** : Surveillance de l'utilisation du stockage
* **Nombre de requêtes** : Monitoring des accès
* **Temps de réponse** : Performance des uploads/downloads
* **Erreurs** : Suivi des échecs d'opérations

Logs de stockage
~~~~~~~~~~~~~~~~

.. code-block:: python

   import logging

   logger = logging.getLogger(__name__)

   async def upload_file(self, file_data: bytes, s3_key: str) -> str:
       try:
           start_time = time.time()
           url = await self._upload_to_s3(file_data, s3_key)
           duration = time.time() - start_time
           
           logger.info(f"File uploaded successfully: {s3_key} ({len(file_data)} bytes, {duration:.2f}s)")
           return url
       except Exception as e:
           logger.error(f"Upload failed for {s3_key}: {e}")
           raise

Backup et récupération
----------------------

Stratégie de backup
~~~~~~~~~~~~~~~~~~~

* **Versioning S3** : Activation du versioning pour la récupération
* **Cross-region replication** : Réplication vers une autre région
* **Lifecycle policies** : Gestion automatique des anciennes versions
* **Monitoring** : Surveillance de l'intégrité des données

Configuration du versioning
~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   def enable_versioning(self):
       """Active le versioning sur le bucket S3"""
       try:
           self.s3_client.put_bucket_versioning(
               Bucket=self.bucket_name,
               VersioningConfiguration={'Status': 'Enabled'}
           )
           logger.info(f"Versioning enabled for bucket: {self.bucket_name}")
       except Exception as e:
           logger.error(f"Failed to enable versioning: {e}")

Lifecycle policies
~~~~~~~~~~~~~~~~~~

Configuration automatique de la gestion des fichiers :

.. code-block:: python

   def configure_lifecycle_policy(self):
       """Configure les politiques de lifecycle"""
       lifecycle_config = {
           'Rules': [
               {
                   'ID': 'DeleteOldVersions',
                   'Status': 'Enabled',
                   'Filter': {'Prefix': ''},
                   'NoncurrentVersionExpiration': {
                       'NoncurrentDays': 30
                   }
               },
               {
                   'ID': 'DeleteIncompleteMultipart',
                   'Status': 'Enabled',
                   'Filter': {'Prefix': ''},
                   'AbortIncompleteMultipartUpload': {
                       'DaysAfterInitiation': 7
                   }
               }
           ]
       }
       
       self.s3_client.put_bucket_lifecycle_configuration(
           Bucket=self.bucket_name,
           LifecycleConfiguration=lifecycle_config
       ) 