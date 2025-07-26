# Migration de Replicate vers RunPod

Ce document explique la migration de l'intégration Replicate vers RunPod pour la génération d'images de try-on virtuel.

## Changements apportés

### 1. Nouveau module RunPod

- **Fichier**: `app/infrastructure/runpod/runpod_client.py`
- **Classes**:
  - `RunPodClient`: Client principal pour interagir avec l'API RunPod
  - `RunPodError`: Exception générique pour les erreurs RunPod
  - `RunPodTimeoutError`: Exception spécifique pour les timeouts

### 2. Configuration mise à jour

- **Fichier**: `app/core/config.py`
- **Nouvelles variables**:
  ```python
  RUNPOD_API_URL: str = os.getenv("RUNPOD_API_URL")
  RUNPOD_API_KEY: str = os.getenv("RUNPOD_API_KEY")
  RUNPOD_TIMEOUT: int = int(os.getenv("RUNPOD_TIMEOUT", 300))
  ```

### 3. Service TryOn modifié

- **Fichier**: `app/features/tryon/tryon_service.py`
- **Fonction modifiée**: `_call_ia()`
- **Changements**:
  - Remplacement de `replicate.run()` par `RunPodClient.run_inference()`
  - Gestion d'erreurs améliorée avec types d'exceptions spécifiques
  - Support des timeouts configurables

## Variables d'environnement

Ajoutez ces variables à votre fichier `.env`:

```bash
# RunPod Configuration
RUNPOD_API_URL=https://api.runpod.ai/v2/YOUR_ENDPOINT_ID
RUNPOD_API_KEY=your_runpod_api_key_here
RUNPOD_TIMEOUT=300  # 5 minutes (optionnel, 300s par défaut)
RUNPOD_UPLOAD_FILES=false  # true pour uploader les fichiers, false pour URLs directes
```

### Format de l'URL RunPod

L'URL doit suivre ce format selon votre type d'endpoint :

- **Endpoint Serverless**: `https://api.runpod.ai/v2/YOUR_ENDPOINT_ID`
- **Endpoint Dédié**: `https://api.runpod.ai/v2/YOUR_ENDPOINT_ID`

## Format des données

### Entrée (input)

Le client envoie les paramètres adaptés pour RunPod :

```json
{
  "person": "https://...",
  "cloth": "https://...",
  "mask": "https://...",
  "steps": 50,
  "guidance_scale": 2.0,
  "return_dict": true
}
```

**Changements par rapport à Replicate :**
- `guidance_scale`: `2.0` (float) au lieu de `2` (int)
- `return_dict`: `true` au lieu de `false`

### Gestion des fichiers

Le client supporte deux modes de gestion des fichiers :

#### Mode 1: URLs directes (recommandé, `RUNPOD_UPLOAD_FILES=false`)
```json
{
  "person": "https://s3.amazonaws.com/bucket/person.jpg",
  "cloth": "https://s3.amazonaws.com/bucket/cloth.jpg",
  "mask": "https://s3.amazonaws.com/bucket/mask.jpg"
}
```
RunPod télécharge directement les images depuis les URLs HTTP.

#### Mode 2: Upload de fichiers (`RUNPOD_UPLOAD_FILES=true`)
```json
{
  "person": "file:///workspace/person.jpg",
  "cloth": "file:///workspace/cloth.jpg", 
  "mask": "file:///workspace/mask.jpg"
}
```
Le client télécharge les images et les upload vers RunPod.

**Note :** Le mode 2 nécessite une implémentation spécifique de l'API d'upload RunPod qui n'est pas encore finalisée. Utilisez le mode 1 pour commencer.

### Sortie (output)

Le client s'attend à recevoir l'URL de l'image générée dans un des formats suivants :

1. **Liste**: `["https://result-image-url.jpg"]`
2. **Objet avec clés standard**:
   ```json
   {
     "image_url": "https://result-image-url.jpg"
   }
   ```
   ou
   ```json
   {
     "output_url": "https://result-image-url.jpg"
   }
   ```
   ou
   ```json
   {
     "url": "https://result-image-url.jpg"
   }
   ```
3. **Chaîne directe**: `"https://result-image-url.jpg"`

## Gestion d'erreurs

### Types d'erreurs gérées

1. **RunPodTimeoutError**: Timeout lors de l'attente du résultat
2. **RunPodError**: Erreurs générales de l'API RunPod
3. **NetworkError**: Erreurs de connectivité réseau

### Retry et polling

Le client utilise un système de polling adaptatif :
- Intervalle initial : 2 secondes
- Intervalle maximum : 10 secondes
- Augmentation progressive : x1.2 à chaque itération

## Tests

### Lancer les tests

```bash
# Tests unitaires
pytest app/infrastructure/runpod/test_runpod_client.py -v

# Test de configuration
python test_runpod_config.py
```

### Scénarios testés

- ✅ Inférence réussie
- ✅ Job qui échoue
- ✅ Timeout
- ✅ Erreurs réseau
- ✅ Format de réponse invalide

## Migration étape par étape

### 1. Configuration

1. Ajoutez les variables d'environnement RunPod
2. Configurez votre endpoint RunPod
3. Testez la connectivité

### 2. Déploiement

1. Déployez le nouveau code
2. Vérifiez les logs pour s'assurer que RunPod fonctionne
3. Surveillez les métriques de performance

### 3. Nettoyage (optionnel)

1. Supprimez les variables Replicate de `.env`
2. Supprimez l'import `import replicate` dans `tryon_service.py`
3. Supprimez les variables Replicate de `config.py`

## Dépannage

### Erreurs communes

#### "RUNPOD_API_URL not configured"
- Vérifiez que `RUNPOD_API_URL` est défini dans `.env`
- Vérifiez le format de l'URL
- ⚠️ **Important**: Si votre URL RunPod se termine par `/run`, gardez-la telle quelle

#### "RUNPOD_API_KEY not configured"
- Vérifiez que `RUNPOD_API_KEY` est défini dans `.env`
- Vérifiez que la clé API est valide

#### "Job timed out"
- Augmentez `RUNPOD_TIMEOUT` si nécessaire
- Vérifiez les performances de votre endpoint RunPod

#### "Could not extract result URL from output"
- Vérifiez le format de sortie de votre modèle RunPod
- Adaptez le code d'extraction dans `_wait_for_result()` si nécessaire

### Logs utiles

```bash
# Logs de début d'inférence
🤖 [RunPod] Starting inference with input: ['person', 'cloth', 'mask']

# Logs de progression
🤖 [RunPod] Job started with ID: job-123
🤖 [RunPod] Job job-123 status: IN_PROGRESS (elapsed: 15.2s)

# Logs de succès
✅ [RunPod] Job job-123 completed: https://result-url.jpg
✅ [IA] RunPod generation completed successfully
```

## Performance

### Comparaison Replicate vs RunPod

| Métrique | Replicate | RunPod |
|----------|-----------|---------|
| Temps de démarrage | ~5-10s | Variable selon endpoint |
| Temps d'inférence | ~20-60s | Variable selon GPU |
| Coût | Fixe par utilisation | Flexible selon configuration |

### Monitoring

Surveillez ces métriques :
- Temps de réponse total
- Taux d'erreur
- Timeouts
- Coût par inférence

## Support

Pour toute question sur cette migration :
1. Vérifiez les logs d'erreur
2. Consultez la documentation RunPod
3. Testez avec un endpoint simple d'abord