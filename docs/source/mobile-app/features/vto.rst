Virtual Try-On (VTO)
====================

La fonctionnalité Virtual Try-On est le cœur de l'application WearIT, permettant aux utilisateurs d'essayer virtuellement des vêtements sur leur avatar.

Vue d'ensemble
--------------

Le VTO utilise une technologie d'IA avancée pour superposer des vêtements sur l'avatar de l'utilisateur, créant une expérience d'essayage réaliste et interactive.

Fonctionnalités principales
---------------------------

Navigation par swipe
~~~~~~~~~~~~~~~~~~~

* **Swipe horizontal** : Navigation fluide entre les tenues
* **Génération automatique** : Création d'une queue de tenues aléatoires
* **Performance optimisée** : Images pré-générées pour un swipe instantané

Double-tap like
~~~~~~~~~~~~~~~

* **Animation de cœur** : Feedback visuel lors du double-tap
* **Système de favoris** : Sauvegarde des tenues préférées
* **Geste intuitif** : Interface similaire à TikTok

Génération d'outfits
~~~~~~~~~~~~~~~~~~~~

* **Algorithme intelligent** : Combinaison automatique de vêtements
* **Personnalisation** : Adaptation aux préférences utilisateur
* **Variété** : Large gamme de styles et combinaisons

Architecture technique
----------------------

Structure des fichiers
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   features/vto/
   ├── component/              # Composants VTO
   │   ├── CreditComponent.tsx
   │   ├── ListClothes.tsx
   │   ├── ModalAddClothInfo.tsx
   │   └── ...
   ├── hooks/                  # Hooks personnalisés
   │   ├── useTryonInpainting.ts
   │   └── useTryonSSE.tsx
   ├── navigation/             # Navigation VTO
   │   ├── VTOMainNavigation.tsx
   │   └── VTOTabNavigator.tsx
   ├── screen/                 # Écrans VTO
   │   ├── VTOHomeScreen.tsx
   │   └── VTOMarketPlace.tsx
   ├── service/                # Services VTO
   │   └── InpaintingService.ts
   ├── slice/                  # Redux slices
   │   ├── sampleTryons.tsx
   │   └── TryonSlice.tsx
   ├── tryonSelectors.ts       # Sélecteurs Redux
   ├── tryonService.ts         # Service API
   └── tryonSlice.ts           # Slice principal

Composants principaux
---------------------

VTOHomeScreen
~~~~~~~~~~~~~

Écran principal du VTO avec la galerie d'images et les contrôles de navigation.

.. code-block:: typescript

   const VTOHomeScreen = () => {
     const [currentImageIndex, setCurrentImageIndex] = useState(0);
     const [imageQueue, setImageQueue] = useState<string[]>([]);
     
     // Logique de génération d'outfits
     const generateRandomOutfit = async () => {
       // Génération d'un outfit aléatoire
     };
     
     return (
       <View style={styles.container}>
         {/* Interface utilisateur */}
       </View>
     );
   };

Gestion d'état Redux
~~~~~~~~~~~~~~~~~~~~

Le VTO utilise plusieurs slices Redux pour gérer son état :

.. code-block:: typescript

   // tryonSlice.ts
   const tryonSlice = createSlice({
     name: 'tryon',
     initialState,
     reducers: {
       setCurrentResult: (state, action) => {
         state.currentResult = action.payload;
       },
       setReadyTryons: (state, action) => {
         state.readyTryons = action.payload;
       },
       setLoading: (state, action) => {
         state.loading = action.payload;
       },
     },
   });

Hooks personnalisés
-------------------

useTryonSSE
~~~~~~~~~~~

Hook pour la gestion des Server-Sent Events (SSE) pour les mises à jour en temps réel :

.. code-block:: typescript

   export const useTryonSSE = () => {
     const [isConnected, setIsConnected] = useState(false);
     const [events, setEvents] = useState<TryonEvent[]>([]);
     
     const connect = useCallback(() => {
       // Logique de connexion SSE
     }, []);
     
     const disconnect = useCallback(() => {
       // Logique de déconnexion
     }, []);
     
     return { isConnected, events, connect, disconnect };
   };

useTryonInpainting
~~~~~~~~~~~~~~~~~~

Hook pour la gestion de l'inpainting (reconstruction d'images) :

.. code-block:: typescript

   export const useTryonInpainting = () => {
     const [isProcessing, setIsProcessing] = useState(false);
     
     const processInpainting = async (imageData: string) => {
       // Logique d'inpainting
     };
     
     return { isProcessing, processInpainting };
   };

Services API
------------

InpaintingService
~~~~~~~~~~~~~~~~~

Service pour la gestion des opérations d'inpainting :

.. code-block:: typescript

   export class InpaintingService {
     static async processImage(imageData: string): Promise<string> {
       // Logique de traitement d'image
     }
     
     static async generateOutfit(parameters: OutfitParams): Promise<string> {
       // Génération d'outfit
     }
   }

tryonService
~~~~~~~~~~~~

Service principal pour les opérations VTO :

.. code-block:: typescript

   export const tryonService = {
     generateTryon: async (params: TryonParams) => {
       const response = await api.post('/tryon/generate', params);
       return response.data;
     },
     
     getReadyTryons: async () => {
       const response = await api.get('/tryon/ready');
       return response.data;
     },
   };

Optimisations de performance
---------------------------

Queue d'images pré-générées
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Pour assurer une navigation fluide, l'application maintient une queue d'images pré-générées :

.. code-block:: typescript

   const generateImageQueue = async () => {
     const queue = [];
     for (let i = 0; i < QUEUE_SIZE; i++) {
       const image = await generateRandomOutfit();
       queue.push(image);
     }
     setImageQueue(queue);
   };

Gestion de la mémoire
~~~~~~~~~~~~~~~~~~~~~

* **Nettoyage automatique** : Suppression des images non utilisées
* **Cache intelligent** : Mise en cache des images fréquemment utilisées
* **Lazy loading** : Chargement à la demande des images

Gestion des erreurs
-------------------

États d'erreur
~~~~~~~~~~~~~~

* **Pas de vêtements disponibles** : Message informatif quand aucun vêtement n'est disponible
* **Erreur de génération** : Gestion des échecs de génération d'outfits
* **Problèmes de connexion** : Gestion des déconnexions réseau

Recovery automatique
~~~~~~~~~~~~~~~~~~~~

* **Retry automatique** : Nouvelle tentative en cas d'échec
* **Fallback** : Utilisation d'images de secours
* **État de chargement** : Feedback visuel pendant les opérations

Tests
------

Stratégie de tests
~~~~~~~~~~~~~~~~~~

* **Tests unitaires** : Tests des composants VTO
* **Tests d'intégration** : Tests des services et hooks
* **Tests de performance** : Tests de charge et de mémoire
* **Tests E2E** : Tests complets du flux VTO

Exemples de tests
~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   describe('VTOHomeScreen', () => {
     it('should generate random outfit on mount', async () => {
       // Test de génération d'outfit
     });
     
     it('should handle double tap like', () => {
       // Test du double-tap
     });
     
     it('should navigate on swipe', () => {
       // Test de navigation
     });
   }); 