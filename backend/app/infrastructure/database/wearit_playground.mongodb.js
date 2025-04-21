/* global use, db */
// MongoDB Playground
// Création de la base de données WearIT

const database = 'wearit_db';
use(database);

// Création des collections
db.createCollection('users');
db.createCollection('body_images');
db.createCollection('wardrobe');
db.createCollection('marketplace');
db.createCollection('tryon_history');
db.createCollection('favorites');
db.createCollection('shares');
db.createCollection('notifications');
db.createCollection('devices');

// Indexation pour les performances
db.users.createIndex({ email: 1 }, { unique: true });
db.body_images.createIndex({ user_id: 1 });
db.wardrobe.createIndex({ user_id: 1 });
db.marketplace.createIndex({ brand: 1 });
db.tryon_history.createIndex({ user_id: 1, body_id: 1, cloth_id: 1 });
db.favorites.createIndex({ user_id: 1, body_id: 1, cloth_id: 1 });
db.shares.createIndex({ user_id: 1, friend_id: 1 });
db.notifications.createIndex({ user_id: 1, is_read: 1 });
db.devices.createIndex({ user_id: 1 });

// Insertion de données d'exemple
db.users.insertOne({
    _id: 'user_123',
    email: 'user@example.com',
    full_name: 'John Doe',
    password_hash: 'hashedpassword123',
    created_at: new Date(),
});

db.body_images.insertOne({
    _id: 'body_456',
    user_id: 'user_123',
    image_url: 'https://s3.bucket.com/body_456.jpg',
    processed: true,
    created_at: new Date(),
});

db.wardrobe.insertOne({
    _id: 'cloth_789',
    user_id: 'user_123',
    name: 'Nike Hoodie',
    type: 'upper',
    image_url: 'https://s3.bucket.com/cloth_789.jpg',
    created_at: new Date(),
});

db.marketplace.insertOne({
    _id: 'marketplace_101',
    brand: 'Nike',
    name: 'Air Max 90',
    type: 'lower',
    image_url: 'https://s3.bucket.com/marketplace_101.jpg',
    price: 129.99,
    purchase_url: 'https://www.nike.com/air-max-90',
    created_at: new Date(),
});

db.tryon_history.insertOne({
    _id: 'tryon_202',
    user_id: 'user_123',
    body_id: 'body_456',
    cloth_id: 'cloth_789',
    image_result_url: 'https://s3.bucket.com/tryon_202.jpg',
    created_at: new Date(),
});

db.favorites.insertOne({
    _id: 'favorite_303',
    user_id: 'user_123',
    body_id: 'body_456',
    cloth_id: 'cloth_789',
    created_at: new Date(),
});

db.shares.insertOne({
    _id: 'share_404',
    user_id: 'user_123',
    friend_id: 'user_999',
    tryon_id: 'tryon_202',
    created_at: new Date(),
});

db.notifications.insertOne({
    _id: 'notif_001',
    user_id: 'user_123',
    type: 'tryon_completed',
    message: 'Votre rendu Try-On est prêt !',
    data: {
        tryon_id: 'tryon_202',
        image_url: 'https://s3.bucket.com/tryon_202.jpg',
    },
    is_read: false,
    created_at: new Date(),
});

db.devices.insertOne({
    _id: 'device_001',
    user_id: 'user_123',
    device_token: 'abcd1234FCMtoken',
    created_at: new Date(),
});

print("✅ Base de données 'wearit_db' initialisée avec succès!");
