Composants de l'application
===========================

L'application WearIT utilise une architecture de composants modulaires et réutilisables, organisés en deux catégories principales : les composants core et les composants spécifiques aux features.

.. toctree::
   :maxdepth: 2
   :caption: Composants:

   core
   choice
   vto-components
   dressing-components

Composants Core
---------------

Composants de base réutilisables dans toute l'application.

Composants de choix
-------------------

Composants pour les interfaces de sélection et de choix.

Composants VTO
--------------

Composants spécifiques à la fonctionnalité Virtual Try-On.

Composants Dressing
-------------------

Composants pour la gestion et l'affichage des vêtements.

Principes de conception
-----------------------

Réutilisabilité
~~~~~~~~~~~~~~~

* **Props flexibles** : Interface claire et extensible
* **Composition** : Assemblage de composants simples
* **Séparation des responsabilités** : Un composant, une fonction

Performance
~~~~~~~~~~~

* **Memoization** : Optimisation des re-renders
* **Lazy loading** : Chargement à la demande
* **Image optimization** : Gestion efficace des images

Accessibilité
~~~~~~~~~~~~~

* **Labels appropriés** : Support des lecteurs d'écran
* **Navigation clavier** : Support de la navigation tactile
* **Contraste** : Respect des standards d'accessibilité

Tests
~~~~~~

* **Tests unitaires** : Couverture complète des composants
* **Tests d'intégration** : Tests des interactions
* **Tests visuels** : Validation de l'apparence 