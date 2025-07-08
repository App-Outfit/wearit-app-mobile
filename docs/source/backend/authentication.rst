Authentification
===============

L'API WearIT utilise un système d'authentification sécurisé basé sur JWT (JSON Web Tokens) et OAuth2.

Vue d'ensemble
--------------

Le système d'authentification comprend :

* **JWT Tokens** : Authentification stateless
* **OAuth2** : Standard d'autorisation
* **Password Hashing** : Sécurisation des mots de passe
* **Email Verification** : Vérification des comptes
* **Password Reset** : Réinitialisation sécurisée

Flux d'authentification
-----------------------

Inscription
~~~~~~~~~~~

1. **Demande d'inscription** : L'utilisateur envoie ses données
2. **Validation** : Vérification des données et unicité de l'email
3. **Hachage du mot de passe** : Sécurisation avec bcrypt
4. **Création du compte** : Enregistrement en base de données
5. **Génération du token** : Création du JWT
6. **Réponse** : Retour du token et des données utilisateur

.. code-block:: python

   async def signup(self, auth_data: AuthSignup) -> AuthSignupResponse:
       # Vérification de l'unicité de l'email
       existing_user = await self.repo.find_user_by_email(auth_data.email)
       if existing_user:
           raise AppError("Email already registered", 409)
       
       # Hachage du mot de passe
       hashed_password = bcrypt.hashpw(
           auth_data.password.encode('utf-8'), 
           bcrypt.gensalt()
       )
       
       # Création de l'utilisateur
       user_data = {
           "email": auth_data.email,
           "password": hashed_password.decode('utf-8'),
           "name": auth_data.name
       }
       user = await self.repo.create_user(user_data)
       
       # Génération du token
       access_token = create_access_token(
           data={"sub": user.email},
           expires_delta=timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
       )
       
       return AuthSignupResponse(
           status="success",
           message="User created successfully",
           data={
               "user": user,
               "access_token": access_token,
               "token_type": "bearer"
           }
       )

Connexion
~~~~~~~~~

1. **Demande de connexion** : L'utilisateur envoie ses identifiants
2. **Vérification de l'utilisateur** : Recherche par email
3. **Validation du mot de passe** : Comparaison avec le hash
4. **Génération du token** : Création du JWT
5. **Réponse** : Retour du token et des données utilisateur

.. code-block:: python

   async def login(self, auth_data: AuthLogin) -> AuthLoginResponse:
       # Recherche de l'utilisateur
       user = await self.repo.find_user_by_email(auth_data.email)
       if not user:
           raise AppError("Invalid credentials", 401)
       
       # Vérification du mot de passe
       if not bcrypt.checkpw(
           auth_data.password.encode('utf-8'), 
           user.password.encode('utf-8')
       ):
           raise AppError("Invalid credentials", 401)
       
       # Génération du token
       access_token = create_access_token(
           data={"sub": user.email},
           expires_delta=timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
       )
       
       return AuthLoginResponse(
           status="success",
           message="Login successful",
           data={
               "user": user,
               "access_token": access_token,
               "token_type": "bearer"
           }
       )

JWT Tokens
----------

Structure du token
~~~~~~~~~~~~~~~~~~

Les tokens JWT contiennent les informations suivantes :

.. code-block:: json

   {
     "sub": "user@example.com",
     "exp": 1640995200,
     "iat": 1640991600,
     "type": "access"
   }

* **sub** : Subject (email de l'utilisateur)
* **exp** : Expiration timestamp
* **iat** : Issued at timestamp
* **type** : Type de token

Génération de token
~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
       to_encode = data.copy()
       if expires_delta:
           expire = datetime.utcnow() + expires_delta
       else:
           expire = datetime.utcnow() + timedelta(minutes=15)
       
       to_encode.update({
           "exp": expire,
           "iat": datetime.utcnow(),
           "type": "access"
       })
       
       encoded_jwt = jwt.encode(
           to_encode, 
           settings.JWT_SECRET_KEY, 
           algorithm=settings.JWT_ALGORITHM
       )
       return encoded_jwt

Validation de token
~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   async def get_current_user(token: str = Depends(oauth2_scheme)):
       credentials_exception = HTTPException(
           status_code=status.HTTP_401_UNAUTHORIZED,
           detail="Could not validate credentials",
           headers={"WWW-Authenticate": "Bearer"},
       )
       
       try:
           payload = jwt.decode(
               token, 
               settings.JWT_SECRET_KEY, 
               algorithms=[settings.JWT_ALGORITHM]
           )
           email: str = payload.get("sub")
           if email is None:
               raise credentials_exception
       except JWTError:
           raise credentials_exception
       
       user = await get_user_by_email(email)
       if user is None:
           raise credentials_exception
       
       return user

OAuth2 avec Bearer
------------------

Configuration
~~~~~~~~~~~~~

L'API utilise OAuth2 avec Bearer tokens :

.. code-block:: python

   oauth2_scheme = OAuth2PasswordBearer(
       tokenUrl=f"{settings.API_V1_STR}/auth/login"
   )

Utilisation dans les endpoints
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   @router.get("/me", response_model=UserResponse)
   async def get_current_user_profile(
       current_user: User = Depends(get_current_user)
   ):
       return UserResponse(
           status="success",
           data={"user": current_user}
       )

Réinitialisation de mot de passe
--------------------------------

Flux de réinitialisation
~~~~~~~~~~~~~~~~~~~~~~~~

1. **Demande de réinitialisation** : L'utilisateur demande un code
2. **Génération du code** : Code à 6 chiffres généré
3. **Envoi par email** : Code envoyé à l'adresse email
4. **Vérification du code** : L'utilisateur vérifie le code
5. **Nouveau mot de passe** : L'utilisateur définit un nouveau mot de passe

Génération du code
~~~~~~~~~~~~~~~~~~

.. code-block:: python

   async def forgot_password(self, payload: ForgotPasswordRequest):
       user = await self.repo.find_user_by_email(payload.email)
       if not user:
           # Pour des raisons de sécurité, on ne révèle pas si l'email existe
           return ForgotPasswordResponse(
               status="success",
               message="If the email exists, a reset code has been sent"
           )
       
       # Génération d'un code à 6 chiffres
       reset_code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
       
       # Stockage du code avec expiration
       await self.repo.save_reset_code(
           user.id, 
           reset_code, 
           settings.PASSWORD_RESET_EXPIRE_MINUTES
       )
       
       # Envoi de l'email
       await self.email_service.send_reset_code(user.email, reset_code)
       
       return ForgotPasswordResponse(
           status="success",
           message="Password reset code sent to email"
       )

Vérification du code
~~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   async def verify_reset_code(self, payload: VerifyResetCodeRequest):
       user = await self.repo.find_user_by_email(payload.email)
       if not user:
           raise AppError("Invalid email", 400)
       
       is_valid = await self.repo.verify_reset_code(
           user.id, 
           payload.code
       )
       
       if not is_valid:
           raise AppError("Invalid or expired code", 400)
       
       return VerifyResetCodeResponse(
           status="success",
           message="Code verified successfully"
       )

Nouveau mot de passe
~~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   async def reset_password(self, payload: ResetPasswordRequest):
       user = await self.repo.find_user_by_email(payload.email)
       if not user:
           raise AppError("Invalid email", 400)
       
       # Vérification du code
       is_valid = await self.repo.verify_reset_code(
           user.id, 
           payload.code
       )
       
       if not is_valid:
           raise AppError("Invalid or expired code", 400)
       
       # Hachage du nouveau mot de passe
       hashed_password = bcrypt.hashpw(
           payload.new_password.encode('utf-8'), 
           bcrypt.gensalt()
       )
       
       # Mise à jour du mot de passe
       await self.repo.update_user_password(
           user.id, 
           hashed_password.decode('utf-8')
       )
       
       # Suppression du code de réinitialisation
       await self.repo.delete_reset_code(user.id)
       
       return ResetPasswordResponse(
           status="success",
           message="Password reset successfully"
       )

Sécurité
--------

Hachage des mots de passe
~~~~~~~~~~~~~~~~~~~~~~~~~

Utilisation de bcrypt pour le hachage sécurisé :

.. code-block:: python

   import bcrypt

   # Hachage
   hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
   
   # Vérification
   is_valid = bcrypt.checkpw(password.encode('utf-8'), hashed)

Expiration des tokens
~~~~~~~~~~~~~~~~~~~~~

Les tokens JWT ont une durée de vie limitée :

.. code-block:: python

   JWT_EXPIRE_MINUTES: int = 60  # 1 heure par défaut
   
   access_token = create_access_token(
       data={"sub": user.email},
       expires_delta=timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
   )

Validation des données
~~~~~~~~~~~~~~~~~~~~~~

Toutes les données d'authentification sont validées avec Pydantic :

.. code-block:: python

   class AuthSignup(BaseModel):
       email: EmailStr
       password: str = Field(..., min_length=8, max_length=128)
       name: str = Field(..., min_length=2, max_length=100)
       
       @validator('password')
       def validate_password(cls, v):
           if not any(c.isupper() for c in v):
               raise ValueError('Password must contain at least one uppercase letter')
           if not any(c.islower() for c in v):
               raise ValueError('Password must contain at least one lowercase letter')
           if not any(c.isdigit() for c in v):
               raise ValueError('Password must contain at least one digit')
           return v

Gestion des erreurs
-------------------

Erreurs d'authentification
~~~~~~~~~~~~~~~~~~~~~~~~~~

* **401 Unauthorized** : Token manquant ou invalide
* **403 Forbidden** : Accès refusé
* **409 Conflict** : Email déjà utilisé
* **422 Unprocessable Entity** : Données invalides

Exemples d'erreurs
~~~~~~~~~~~~~~~~~~

.. code-block:: json

   {
     "error": "Invalid credentials",
     "status_code": 401
   }

.. code-block:: json

   {
     "error": "Email already registered",
     "status_code": 409
   }

.. code-block:: json

   {
     "error": "Invalid or expired code",
     "status_code": 400
   } 