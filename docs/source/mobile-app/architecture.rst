Architecture de l'application
============================

L'application WearIT suit une architecture modulaire basée sur les fonctionnalités (Feature-Based Architecture) avec une séparation claire des responsabilités.

Principe d'architecture
-----------------------

L'application est organisée selon le principe **"Feature-First"** où chaque fonctionnalité est autonome et contient tous les éléments nécessaires à son fonctionnement.

Structure des features
----------------------

Chaque feature suit une structure standardisée :

.. code-block:: text

   features/feature-name/
   ├── components/          # Composants spécifiques à la feature
   ├── screens/            # Écrans de la feature
   ├── navigation/         # Configuration de navigation
   ├── hooks/              # Hooks personnalisés
   ├── services/           # Services API
   ├── slices/             # Redux slices
   ├── selectors/          # Redux selectors
   ├── types/              # Types TypeScript
   └── utils/              # Utilitaires spécifiques

Patterns utilisés
-----------------

Redux Toolkit (RTK)
~~~~~~~~~~~~~~~~~~~

Utilisation de Redux Toolkit pour la gestion d'état globale :

.. code-block:: typescript

   // Exemple de slice RTK
   const authSlice = createSlice({
     name: 'auth',
     initialState,
     reducers: {
       setUser: (state, action) => {
         state.user = action.payload;
       },
     },
     extraReducers: (builder) => {
       builder.addCase(loginUser.fulfilled, (state, action) => {
         state.user = action.payload;
       });
     },
   });

React Navigation
~~~~~~~~~~~~~~~~

Navigation hiérarchique avec React Navigation :

.. code-block:: typescript

   // Exemple de navigator
   const VTOMainNavigation = () => {
     return (
       <Stack.Navigator>
         <Stack.Screen name="VTOHome" component={VTOHomeScreen} />
         <Stack.Screen name="VTODetail" component={VTODetailScreen} />
       </Stack.Navigator>
     );
   };

Custom Hooks
~~~~~~~~~~~~

Hooks personnalisés pour la logique métier :

.. code-block:: typescript

   // Exemple de custom hook
   export const useTryonSSE = () => {
     const [isConnected, setIsConnected] = useState(false);
     
     const connect = useCallback(() => {
       // Logique de connexion SSE
     }, []);
     
     return { isConnected, connect };
   };

Gestion des données
-------------------

API Integration
~~~~~~~~~~~~~~~

L'application communique avec le backend via des services API :

.. code-block:: typescript

   // Exemple de service API
   export const authService = {
     login: async (credentials: LoginCredentials) => {
       const response = await api.post('/auth/login', credentials);
       return response.data;
     },
   };

State Management
~~~~~~~~~~~~~~~~

Gestion d'état avec Redux Toolkit et sélecteurs optimisés :

.. code-block:: typescript

   // Exemple de selector
   export const selectCurrentUser = (state: RootState) => 
     state.auth.user;
   
   export const selectIsAuthenticated = (state: RootState) => 
     !!state.auth.user;

Performance
-----------

Optimisations mises en place
~~~~~~~~~~~~~~~~~~~~~~~~~~~

* **Memoization** : Utilisation de `useMemo` et `useCallback`
* **Lazy Loading** : Chargement à la demande des composants
* **Image Optimization** : Compression et cache des images
* **Redux Optimization** : Sélecteurs optimisés avec `reselect`

Gestion de la mémoire
~~~~~~~~~~~~~~~~~~~~~

* **Cleanup** : Nettoyage des listeners et timers
* **Image Caching** : Cache des images pour éviter les re-téléchargements
* **Component Unmounting** : Nettoyage des ressources lors du démontage

Sécurité
---------

Authentification
~~~~~~~~~~~~~~~~

* **JWT Tokens** : Authentification par tokens
* **Token Refresh** : Renouvellement automatique des tokens
* **Secure Storage** : Stockage sécurisé des données sensibles

Validation des données
~~~~~~~~~~~~~~~~~~~~~~

* **TypeScript** : Typage statique pour la sécurité des types
* **Runtime Validation** : Validation des données à l'exécution
* **Input Sanitization** : Nettoyage des entrées utilisateur

Tests
------

Stratégie de tests
~~~~~~~~~~~~~~~~~~

* **Unit Tests** : Tests des composants et fonctions
* **Integration Tests** : Tests d'intégration des features
* **E2E Tests** : Tests end-to-end avec Detox

Outils de test
~~~~~~~~~~~~~~

* **Jest** : Framework de test
* **React Native Testing Library** : Tests des composants
* **Detox** : Tests E2E 