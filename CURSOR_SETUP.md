# 🚀 Guide Cursor AI pour WearIT

## Configuration Initiale

### 1. Installation des Extensions
Cursor AI va automatiquement suggérer les extensions recommandées. Installe-les toutes pour une expérience optimale.

### 2. Configuration du Projet
Le fichier `.cursorrules` configure Cursor AI spécifiquement pour WearIT. Il comprend :
- Standards de code (TypeScript, Python, React Native)
- Architecture du projet
- Patterns de développement
- Guidelines de sécurité

### 3. Snippets Personnalisés
Utilise ces raccourcis pour accélérer le développement :
- `rncomp` : Composant React Native avec Redux
- `fapi` : Endpoint FastAPI complet
- `rslice` : Slice Redux Toolkit
- `rnscreen` : Écran React Native
- `mmodel` : Modèle MongoDB avec Pydantic

## Techniques Avancées

### Prompts Efficaces

**Développement de fonctionnalités :**
```
"Crée un composant React Native pour [fonctionnalité] qui suit les patterns du projet WearIT, utilise MaterialCommunityIcons, et inclut la gestion d'état Redux"
```

**Optimisation :**
```
"Analyse ce code pour les problèmes de performance et suggère des optimisations spécifiques à React Native"
```

**Debugging :**
```
"Debug cette erreur en tenant compte de l'architecture WearIT (React Native + FastAPI + MongoDB)"
```

**Tests :**
```
"Génère des tests unitaires pour ce composant en utilisant Jest et React Native Testing Library"
```

### Commandes Cursor AI

- `Cmd/Ctrl + K` : Chat contextuel
- `Cmd/Ctrl + L` : Chat en ligne
- `Cmd/Ctrl + I` : Inline edit
- `Cmd/Ctrl + Shift + L` : Multi-cursor avec AI
- `/review` : Analyse de code
- `/doc` : Génération de documentation
- `/refactor` : Refactorisation

### Workflow de Collaboration

1. **Code Reviews :**
   - Utilise `/review` pour analyser le code
   - Demande des suggestions d'amélioration
   - Vérifie la cohérence avec l'architecture

2. **Documentation :**
   - Génère des docstrings avec `/doc`
   - Crée des diagrammes d'architecture
   - Maintient la documentation à jour

3. **Debugging :**
   - Sélectionne le code problématique
   - Pose des questions spécifiques
   - Utilise `/explain` pour comprendre le code existant

## Bonnes Pratiques

### 1. Utilisation du Chat Contextuel
- Sélectionne toujours le code pertinent avant de poser une question
- Fournis le contexte nécessaire (erreur, fonctionnalité, etc.)
- Sois spécifique dans tes demandes

### 2. Code Reviews
- Utilise Cursor AI pour analyser le code avant les PR
- Demande des suggestions d'amélioration
- Vérifie la cohérence avec l'architecture

### 3. Documentation
- Génère automatiquement les docstrings
- Maintiens la documentation à jour
- Utilise les diagrammes pour expliquer l'architecture

### 4. Tests
- Génère des tests unitaires avec Cursor AI
- Demande des suggestions de test cases
- Optimise la couverture de tests

## Configuration Git

Le projet inclut un hook pre-commit qui :
- Vérifie la syntaxe TypeScript
- Lance ESLint et Prettier
- Vérifie le formatage Python (Black)
- Lance les tests de documentation

## Ressources

- [Documentation Cursor AI](https://cursor.sh/docs)
- [Guide React Native](https://reactnative.dev/docs/getting-started)
- [Documentation FastAPI](https://fastapi.tiangolo.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

## Support

Pour toute question sur l'utilisation de Cursor AI dans le projet WearIT, consulte ce guide ou demande de l'aide à l'équipe.
