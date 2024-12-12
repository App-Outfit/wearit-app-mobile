Introduction
============

Welcome to the WearIT backend documentation! 🎉

WearIT is an innovative **AI-powered digital wardrobe** application, allowing users to virtually try on clothes and visualize their outfits realistically. The backend is at the core of WearIT's functionality, managing users, image processing, communication with external services, and coordination of asynchronous processes.

---

📌 **Core Backend Features**

1. **User Authentication**:
   - Registration, login, and password management.
   - Support for third-party authentication (Google, Apple).

2. **Image Preprocessing**:
   - **Body**: Landmark detection and body segmentation.
   - **Clothing**: Segmentation and mask creation for clothing items.

3. **Asynchronous Task Management**:
   - Use of **Kafka** for efficient and scalable background task processing.

4. **Data Storage**:
   - Use of **MongoDB** to store user information and preprocessing data.
   - Storage of images and masks in **Amazon S3**.

5. **Security**:
   - Password encryption with **bcrypt**.
   - Access token management with **JWT**.

---

🗂️ **Technologies Used**

- **Web Framework**: FastAPI
- **Database**: MongoDB
- **Message Broker**: Apache Kafka
- **Image Storage**: Amazon S3
- **Security**: JWT, bcrypt
- **Language**: Python 3.12