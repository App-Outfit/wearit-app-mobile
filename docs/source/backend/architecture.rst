Architecture du Backend
======================

L'architecture du backend WearIT suit les principes de **Clean Architecture** et **Domain-Driven Design** pour assurer une séparation claire des responsabilités et une maintenabilité optimale.

Principe d'architecture
-----------------------

L'application est organisée selon le principe **"Feature-First"** où chaque fonctionnalité métier est autonome et contient tous les éléments nécessaires à son fonctionnement.

Structure des features
----------------------

Chaque feature suit une structure standardisée :

.. code-block:: text

   features/feature-name/
   ├── feature_route.py      # Endpoints API FastAPI
   ├── feature_service.py    # Logique métier
   ├── feature_repo.py       # Accès aux données
   ├── feature_schema.py     # Modèles Pydantic
   └── feature_model.py      # Modèles de données (optionnel)

Patterns utilisés
-----------------

Repository Pattern
~~~~~~~~~~~~~~~~~~

Chaque feature utilise le pattern Repository pour l'accès aux données :

.. code-block:: python

   class AuthRepository:
       def __init__(self, db: Database):
           self.db = db
       
       async def create_user(self, user_data: dict) -> User:
           # Logique d'accès aux données
           pass
       
       async def find_user_by_email(self, email: str) -> Optional[User]:
           # Logique de recherche
           pass

Service Layer
~~~~~~~~~~~~~

La logique métier est encapsulée dans des services :

.. code-block:: python

   class AuthService:
       def __init__(self, repo: AuthRepository, storage: StorageRepository):
           self.repo = repo
           self.storage = storage
       
       async def signup(self, auth_data: AuthSignup) -> AuthSignupResponse:
           # Logique métier d'inscription
           pass
       
       async def login(self, auth_data: AuthLogin) -> AuthLoginResponse:
           # Logique métier de connexion
           pass

Dependency Injection
~~~~~~~~~~~~~~~~~~~

FastAPI utilise l'injection de dépendances pour la configuration des services :

.. code-block:: python

   def get_auth_service(db = Depends(get_db)):
       return AuthService(
           AuthRepository(db), 
           storage=StorageRepository()
       )

   @router.post("/signup", response_model=AuthSignupResponse)
   async def signup(
       auth: AuthSignup,
       service: AuthService = Depends(get_auth_service)
   ):
       return await service.signup(auth)

Gestion des données
-------------------

Base de données MongoDB
~~~~~~~~~~~~~~~~~~~~~~~

L'application utilise MongoDB comme base de données principale :

.. code-block:: python

   class MongoDB:
       def __init__(self):
           self.client = None
           self.db = None
       
       async def connect(self, db_url: str, db_name: str):
           self.client = AsyncIOMotorClient(db_url)
           self.db = self.client[db_name]
       
       async def close(self):
           if self.client:
               self.client.close()

Stockage AWS S3
~~~~~~~~~~~~~~~

Les fichiers et images sont stockés sur AWS S3 :

.. code-block:: python

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

Gestion des erreurs
-------------------

Système centralisé
~~~~~~~~~~~~~~~~~~

L'application utilise un système centralisé de gestion des erreurs :

.. code-block:: python

   class AppError(Exception):
       def __init__(self, message: str, status_code: int = 400):
           self.message = message
           self.status_code = status_code
           super().__init__(self.message)

   async def global_exception_handler(request: Request, exc: Exception):
       if isinstance(exc, AppError):
           return JSONResponse(
               status_code=exc.status_code,
               content={"error": exc.message}
           )
       # Gestion des autres exceptions...

Validation des données
---------------------

Pydantic Models
~~~~~~~~~~~~~~~

Toutes les données sont validées avec des modèles Pydantic :

.. code-block:: python

   class AuthSignup(BaseModel):
       email: EmailStr
       password: str = Field(..., min_length=8)
       name: str = Field(..., min_length=2)
       
       class Config:
           json_schema_extra = {
               "example": {
                   "email": "user@example.com",
                   "password": "securepassword123",
                   "name": "John Doe"
               }
           }

Authentification
----------------

JWT Tokens
~~~~~~~~~~

L'authentification utilise des tokens JWT :

.. code-block:: python

   def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
       to_encode = data.copy()
       if expires_delta:
           expire = datetime.utcnow() + expires_delta
       else:
           expire = datetime.utcnow() + timedelta(minutes=15)
       to_encode.update({"exp": expire})
       encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
       return encoded_jwt

OAuth2 avec Bearer
~~~~~~~~~~~~~~~~~~

L'API utilise OAuth2 avec Bearer tokens :

.. code-block:: python

   oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{API_V1_STR}/auth/login")

   async def get_current_user(token: str = Depends(oauth2_scheme)):
       credentials_exception = HTTPException(
           status_code=status.HTTP_401_UNAUTHORIZED,
           detail="Could not validate credentials",
           headers={"WWW-Authenticate": "Bearer"},
       )
       try:
           payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
           username: str = payload.get("sub")
           if username is None:
               raise credentials_exception
       except JWTError:
           raise credentials_exception
       return user

Communication en temps réel
---------------------------

WebSockets
~~~~~~~~~~

L'API supporte les WebSockets pour les mises à jour en temps réel :

.. code-block:: python

   @router.websocket("/ws")
   async def tryon_ws(
       websocket: WebSocket,
       user = Depends(get_user_from_token),
       service: TryonService = Depends(get_service),
   ):
       await websocket.accept()
       await service.stream_tryon_ws(websocket, user.id)

Performance
-----------

Optimisations mises en place
~~~~~~~~~~~~~~~~~~~~~~~~~~~

* **Async/Await** : Utilisation d'async pour les opérations I/O
* **Connection Pooling** : Pool de connexions MongoDB
* **Caching** : Cache des données fréquemment accédées
* **Lazy Loading** : Chargement à la demande des données

Monitoring et logging
~~~~~~~~~~~~~~~~~~~~~

* **Structured Logging** : Logs structurés avec contexte
* **Performance Monitoring** : Monitoring des temps de réponse
* **Error Tracking** : Suivi des erreurs et exceptions
* **Health Checks** : Endpoints de vérification de santé

Tests
------

Stratégie de tests
~~~~~~~~~~~~~~~~~~

* **Unit Tests** : Tests des services et repositories
* **Integration Tests** : Tests des endpoints API
* **E2E Tests** : Tests complets du flux
* **Performance Tests** : Tests de charge

Exemples de tests
~~~~~~~~~~~~~~~~~

.. code-block:: python

   def test_auth_service_signup():
       # Arrange
       mock_repo = Mock()
       service = AuthService(mock_repo)
       
       # Act
       result = service.signup(auth_data)
       
       # Assert
       assert result.status == "success"

Déploiement
-----------

Configuration Docker
~~~~~~~~~~~~~~~~~~~

.. code-block:: dockerfile

   FROM python:3.11-slim
   
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   
   COPY . .
   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

Variables d'environnement
~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   # Base de données
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DATABASE=wearit
   
   # Authentification
   JWT_SECRET_KEY=your-secret-key
   JWT_ALGORITHM=HS256
   
   # AWS S3
   AWS_REGION_NAME=us-east-1
   AWS_BUCKET_NAME=wearit-storage
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key 