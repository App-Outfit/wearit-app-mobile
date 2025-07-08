Aperçu de l'application
=======================

WearIT est une application mobile innovante qui permet aux utilisateurs d'essayer virtuellement des vêtements grâce à la technologie de Virtual Try-On (VTO).

Fonctionnalités principales
---------------------------

Authentification et Onboarding
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* **Inscription/Connexion** : Système d'authentification sécurisé
* **Création d'avatar** : Personnalisation du profil utilisateur
* **Onboarding** : Guide d'introduction pour les nouveaux utilisateurs

Virtual Try-On (VTO)
~~~~~~~~~~~~~~~~~~~~

* **Essayage virtuel** : Test de vêtements sur l'avatar utilisateur
* **Galerie d'images** : Navigation par swipe entre les tenues
* **Double-tap like** : Système de favoris avec animation
* **Génération aléatoire** : Création automatique de tenues

Gestion des vêtements
~~~~~~~~~~~~~~~~~~~~~

* **Upload de vêtements** : Ajout de nouveaux articles
* **Catégorisation** : Organisation par types et marques
* **Favoris** : Système de collection personnelle

Exploration
~~~~~~~~~~~

* **Découverte** : Découverte de nouvelles tenues
* **Recommandations** : Suggestions personnalisées
* **Tendances** : Tenues populaires

Profil utilisateur
~~~~~~~~~~~~~~~~~~

* **Gestion du profil** : Modification des informations personnelles
* **Paramètres** : Configuration de l'application
* **Abonnements** : Gestion des plans premium

Architecture technique
----------------------

Structure du projet
~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   app/src/
   ├── components/          # Composants réutilisables
   ├── features/           # Fonctionnalités par domaine
   │   ├── auth/          # Authentification
   │   ├── vto/           # Virtual Try-On
   │   ├── clothing/      # Gestion des vêtements
   │   ├── explorer/      # Exploration
   │   ├── profil/        # Profil utilisateur
   │   └── ...
   ├── navigation/        # Configuration de navigation
   ├── store/            # Gestion d'état Redux
   ├── services/         # Services API
   ├── utils/            # Utilitaires
   └── types/            # Types TypeScript

État de l'application
~~~~~~~~~~~~~~~~~~~~~

L'application utilise **Redux Toolkit** pour la gestion d'état avec les slices suivants :

* **authSlice** : État d'authentification
* **vtoSlice** : État du Virtual Try-On
* **clothingSlice** : Gestion des vêtements
* **userSlice** : Données utilisateur
* **favoriteSlice** : Favoris
* **bodySlice** : Données corporelles

Navigation
~~~~~~~~~~

Utilise **React Navigation** avec une structure hiérarchique :

* **AuthNavigator** : Écrans d'authentification
* **MainTabNavigator** : Navigation principale par onglets
* **VTOMainNavigation** : Navigation VTO
* **DressingNavigator** : Navigation dressing
* **ExplorerNavigator** : Navigation exploration
* **ProfilNavigator** : Navigation profil 