Introduction
============

Bienvenue dans la documentation du backend de WearIT ! 🎉

WearIT est une application innovante de **dressing numérique avec intelligence artificielle (IA)**, permettant aux utilisateurs d’essayer virtuellement des vêtements et de visualiser leurs tenues de manière réaliste. Le backend est au cœur du fonctionnement de WearIT, gérant les utilisateurs, le traitement des images, la communication avec les services externes et la coordination des processus asynchrones.

---

📌 **Fonctionnalités Principales du Backend**

1. **Authentification des Utilisateurs** :
   - Inscription, connexion et gestion des mots de passe.
   - Support des authentifications tierces (Google, Apple).

2. **Prétraitement des Images** :
   - **Body** : Détection des points de repère et segmentation du corps.
   - **Vêtements** : Segmentation et création de masques pour les vêtements.

3. **Gestion des Tâches Asynchrones** :
   - Utilisation de **Kafka** pour traiter les tâches en arrière-plan de manière efficace et scalable.

4. **Stockage des Données** :
   - Utilisation de **MongoDB** pour stocker les informations des utilisateurs et des prétraitements.
   - Stockage des images et des masques dans **Amazon S3**.

5. **Sécurité** :
   - Sécurisation des mots de passe avec **bcrypt**.
   - Gestion des tokens d'accès avec **JWT**.

---

🗂️ **Technologies Utilisées**

- **Framework Web** : FastAPI
- **Base de Données** : MongoDB
- **Message Broker** : Apache Kafka
- **Stockage d’Images** : Amazon S3
- **Sécurité** : JWT, bcrypt
- **Langage** : Python 3.12