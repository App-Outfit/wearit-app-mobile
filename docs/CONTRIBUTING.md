# Guide de contribution à la documentation WearIT

Ce guide explique comment contribuer à la documentation de l'application WearIT.

## 📋 Table des matières

- [Structure de la documentation](#structure-de-la-documentation)
- [Comment ajouter du contenu](#comment-ajouter-du-contenu)
- [Conventions d'écriture](#conventions-décriture)
- [Génération de la documentation](#génération-de-la-documentation)
- [Tests et validation](#tests-et-validation)

## 📁 Structure de la documentation

La documentation est organisée en deux parties principales :

```
docs/
├── source/
│   ├── mobile-app/          # Documentation React Native
│   │   ├── index.rst        # Page d'accueil mobile
│   │   ├── overview.rst     # Aperçu de l'application
│   │   ├── architecture.rst # Architecture technique
│   │   ├── features/        # Documentation des features
│   │   │   ├── index.rst
│   │   │   ├── vto.rst      # Virtual Try-On
│   │   │   ├── auth.rst     # Authentification
│   │   │   └── ...
│   │   └── components/      # Documentation des composants
│   │       ├── index.rst
│   │       ├── core.rst     # Composants core
│   │       └── ...
│   ├── backend/             # Documentation Backend
│   │   ├── index.rst        # Page d'accueil backend
│   │   ├── api.rst          # Documentation API
│   │   └── ...
│   ├── index.rst            # Page d'accueil principale
│   └── conf.py              # Configuration Sphinx
├── build/                   # Documentation générée
├── Makefile                 # Commandes de génération
├── generate_docs.sh         # Script de génération
└── README.md               # Guide principal
```

## ✍️ Comment ajouter du contenu

### 1. Ajouter une nouvelle feature

Pour documenter une nouvelle feature :

1. **Créer le fichier RST** dans `docs/source/mobile-app/features/`
2. **Ajouter l'entrée** dans `docs/source/mobile-app/features/index.rst`
3. **Suivre le template** :

```rst
Nom de la Feature
=================

Description courte de la feature.

Fonctionnalités
---------------

* **Fonctionnalité 1** : Description
* **Fonctionnalité 2** : Description

Architecture
------------

.. code-block:: typescript

   // Exemple de code
   const MyComponent = () => {
     return <View />;
   };

API
----

Description des endpoints ou interfaces.

Tests
-----

Stratégie de tests pour cette feature.
```

### 2. Ajouter un nouveau composant

Pour documenter un nouveau composant :

1. **Créer le fichier RST** dans `docs/source/mobile-app/components/`
2. **Ajouter l'entrée** dans `docs/source/mobile-app/components/index.rst`
3. **Inclure** :

```rst
Nom du Composant
================

Description du composant.

Props
-----

.. code-block:: typescript

   interface ComponentProps {
     prop1: string;
     prop2?: number;
   }

Utilisation
-----------

.. code-block:: typescript

   <MyComponent prop1="value" prop2={42} />

Exemples
--------

Exemples d'utilisation du composant.
```

### 3. Ajouter de la documentation backend

Pour documenter une nouvelle API :

1. **Créer le fichier RST** dans `docs/source/backend/`
2. **Ajouter l'entrée** dans `docs/source/backend/index.rst`
3. **Inclure** :

```rst
Nom de l'API
============

Description de l'API.

Endpoints
---------

POST /api/endpoint
~~~~~~~~~~~~~~~~~~

Description de l'endpoint.

**Paramètres :**

* ``param1`` (string) : Description
* ``param2`` (number) : Description

**Réponse :**

.. code-block:: json

   {
     "status": "success",
     "data": {}
   }

**Codes d'erreur :**

* ``400`` : Paramètres invalides
* ``401`` : Non authentifié
* ``500`` : Erreur serveur
```

## 📝 Conventions d'écriture

### Style général

- **Utiliser le français** pour la documentation utilisateur
- **Utiliser l'anglais** pour les noms techniques (variables, fonctions)
- **Être concis** mais complet
- **Inclure des exemples** de code
- **Utiliser des listes** pour les énumérations

### Formatage RST

#### Titres

```rst
Titre principal
==============

Sous-titre
----------

Sous-sous-titre
~~~~~~~~~~~~~~~
```

#### Code

```rst
.. code-block:: typescript

   const example = "code";
```

#### Liens

```rst
`Texte du lien <URL>`_
```

#### Images

```rst
.. image:: /path/to/image.png
   :alt: Description de l'image
   :width: 400px
```

#### Notes et avertissements

```rst
.. note::

   Information importante.

.. warning::

   Avertissement important.
```

### Docstrings

#### Python (Backend)

```python
def my_function(param1: str, param2: int) -> bool:
    """Description courte de la fonction.

    Args:
        param1 (str): Description du paramètre.
        param2 (int): Description du paramètre.

    Raises:
        ValueError: Quand param2 est négatif.

    Returns:
        bool: Description de la valeur de retour.

    Example:
        >>> my_function("test", 42)
        True
    """
    return True
```

#### TypeScript/React (Frontend)

```typescript
/**
 * Description courte de la fonction.
 * 
 * @param param1 - Description du paramètre
 * @param param2 - Description du paramètre
 * @returns Description de la valeur de retour
 * 
 * @example
 * ```typescript
 * const result = myFunction("test", 42);
 * ```
 */
export const myFunction = (param1: string, param2: number): boolean => {
  return true;
};
```

## 🚀 Génération de la documentation

### Utilisation du script

```bash
# Générer la documentation HTML
./generate_docs.sh html

# Démarrer le serveur de développement
./generate_docs.sh serve

# Nettoyer et régénérer
./generate_docs.sh clean
./generate_docs.sh html
```

### Commandes manuelles

```bash
# Nettoyer
make clean

# Générer HTML
make html

# Générer PDF (nécessite LaTeX)
make latexpdf
```

## ✅ Tests et validation

### Vérifications avant commit

1. **Générer la documentation** :
   ```bash
   ./generate_docs.sh html
   ```

2. **Vérifier les erreurs** dans la sortie de génération

3. **Tester la navigation** en ouvrant `build/html/index.html`

4. **Vérifier les liens** et les références

### Checklist de validation

- [ ] La documentation se génère sans erreurs
- [ ] Tous les liens fonctionnent
- [ ] Les exemples de code sont corrects
- [ ] La navigation est logique
- [ ] Les images sont présentes et correctes
- [ ] Le style est cohérent

### Erreurs courantes

#### Erreurs de syntaxe RST

```rst
# Incorrect
Titre
----

# Correct
Titre
-----
```

#### Liens cassés

```rst
# Incorrect
:ref:`page_inexistante`

# Correct
:ref:`page_existante`
```

#### Code mal formaté

```rst
# Incorrect
.. code-block:: typescript
const example = "code";

# Correct
.. code-block:: typescript

   const example = "code";
```

## 🤝 Contribution

### Processus de contribution

1. **Créer une branche** pour votre modification
2. **Faire les modifications** selon ce guide
3. **Tester la génération** de la documentation
4. **Créer une pull request** avec description détaillée

### Bonnes pratiques

- **Documenter au fur et à mesure** du développement
- **Mettre à jour la documentation** quand le code change
- **Inclure des exemples** pratiques
- **Tester la documentation** générée
- **Demander des reviews** pour les grosses modifications

### Questions et support

Pour toute question sur la documentation :

1. Consultez ce guide
2. Regardez les exemples existants
3. Ouvrez une issue sur le repository
4. Contactez l'équipe de développement 