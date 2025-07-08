# 📚 WearIT Application Documentation Guide

Ce guide explique comment générer et consulter la documentation pour l'application WearIT (backend Python et application mobile React Native) localement. Il couvre également les bonnes pratiques pour écrire des docstrings en utilisant le **style Google** et explique leur importance.

---

## 🛠️ Prérequis

Assurez-vous d'avoir installé :

- **Python** (version 3.8 ou supérieure)
- **Sphinx** et les extensions nécessaires

### Installation des dépendances

Installez les dépendances requises en utilisant `requirements.txt` :

```bash
pip install -r requirements.txt
```

---

## 🚀 Génération et consultation de la documentation localement

### 1. Naviguer vers le répertoire de documentation

```bash
cd docs
```

### 2. Nettoyer les builds précédents

```bash
make clean
```

### 3. Générer la documentation HTML

```bash
make html
```

### 4. Consulter la documentation

Ouvrez le fichier `index.html` généré dans votre navigateur :

```bash
# Linux
xdg-open build/html/index.html

# Firefox
firefox build/html/index.html

# macOS
open build/html/index.html

# Windows
start build\html\index.html
```

---

## 📝 Ajouter de nouveaux fichiers ou fonctions à la documentation

Lorsque vous ajoutez de nouveaux fichiers ou fonctions au projet, vous devez régénérer les fichiers `.rst` pour qu'ils soient inclus dans la documentation.

#### Exemple `requirements.txt`

```txt
sphinx>=4.0
sphinx_rtd_theme
sphinx_js
```

### Générer les fichiers `.rst` pour de nouveaux modules ou fonctions

Naviguez vers le répertoire `docs` et exécutez la commande suivante pour régénérer les fichiers `.rst` pour votre code source :

#### Pour le backend Python

```bash
sphinx-apidoc -f -o source ../backend/src
```

#### Pour l'application mobile React Native

```bash
# Génération manuelle des fichiers .rst pour React Native
# Les fichiers sont créés manuellement dans docs/source/mobile-app/
```

- **`-f`** : Force l'écrasement des fichiers `.rst` existants.
- **`-o source`** : Spécifie le répertoire de sortie pour les fichiers `.rst` générés.
- **`../backend/src`** : Chemin vers le répertoire du code source.

### Reconstruire la documentation

Après avoir généré les fichiers `.rst`, nettoyez et reconstruisez la documentation :

```bash
make clean
make html
```

---

## 🖋️ Écrire des Docstrings

### Pourquoi utiliser des Docstrings ?

Les docstrings sont essentielles pour :

- **Clarté du code** : Elles expliquent ce que fait une fonction, classe ou module.
- **Documentation automatique** : Des outils comme **Sphinx** génèrent la documentation à partir des docstrings.
- **Maintenabilité** : Elles aident les développeurs à comprendre et maintenir le code.

### Style Google pour les Docstrings

Le projet WearIT utilise le **style Google** pour les docstrings.

#### Exemple de Docstring Python

```python
def create_user(name: str, email: str, password: str) -> str:
    """Create a new user in the database and return an access token.

    Args:
        name (str): The name of the user.
        email (str): The email address of the user.
        password (str): The plaintext password of the user.

    Raises:
        HTTPException: If the user already exists.

    Returns:
        str: A JWT access token for the newly created user.
    """
    return "token"
```

#### Exemple de Docstring TypeScript/React

```typescript
/**
 * Hook personnalisé pour la gestion du Virtual Try-On
 * 
 * @param initialOutfit - L'outfit initial à afficher
 * @returns Un objet contenant l'état actuel et les fonctions de contrôle
 */
export const useVirtualTryOn = (initialOutfit?: Outfit) => {
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(initialOutfit || null);
  
  /**
   * Génère un outfit aléatoire
   * 
   * @returns Promise<string> - L'URI de l'image générée
   */
  const generateRandomOutfit = async (): Promise<string> => {
    // Logique de génération
  };
  
  return { currentOutfit, generateRandomOutfit };
};
```

### Sections des Docstrings

1. **Résumé** : Une description en une ligne de la fonction.
2. **Args/Params** : Décrit les paramètres, y compris leurs types.
3. **Raises** : Liste les exceptions que la fonction peut lever.
4. **Returns** : Décrit la valeur de retour et son type.

---

## 📂 Structure des répertoires

```
wearit-app-mobile/
│-- docs/
│   ├── source/
│   │   ├── conf.py
│   │   ├── index.rst
│   │   ├── mobile-app/          # Documentation React Native
│   │   │   ├── index.rst
│   │   │   ├── overview.rst
│   │   │   ├── architecture.rst
│   │   │   ├── features/
│   │   │   ├── components/
│   │   │   └── ...
│   │   ├── backend/             # Documentation Backend
│   │   │   ├── index.rst
│   │   │   └── ...
│   │   └── _templates/
│   ├── Makefile
│   ├── make.bat
│   ├── requirements.txt
│   └── README.md
```

---

## 🔄 Commandes utiles

- **Nettoyer le Build** :

  ```bash
  make clean
  ```

- **Générer la Documentation HTML** :

  ```bash
  make html
  ```

- **Générer la Documentation PDF** (nécessite `latex`) :

  ```bash
  make latexpdf
  ```

---

## 🕵️‍♂️ Dépannage

- **Erreurs d'Import de Module** :  
  Assurez-vous que le chemin dans `conf.py` est correct :

  ```python
  import os
  import sys
  sys.path.insert(0, os.path.abspath('../../backend/src'))
  ```

- **Dépendances Manquantes** :  
  Installez les dépendances listées dans `requirements.txt` :

  ```bash
  pip install -r requirements.txt
  ```

- **Problèmes de Permissions** :  
  Assurez-vous que tous les fichiers et dossiers nécessaires ont les bonnes permissions :

  ```bash
  chmod -R 755 backend/src
  ```

---

## 📚 Ressources supplémentaires

- [Documentation Sphinx](https://www.sphinx-doc.org/en/master/)
- [Guide de style Google pour les Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)
- [Guide Read the Docs](https://docs.readthedocs.io/en/stable/)
- [Documentation React Native](https://reactnative.dev/docs/getting-started)
- [Documentation TypeScript](https://www.typescriptlang.org/docs/)

---