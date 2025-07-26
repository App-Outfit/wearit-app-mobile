# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WearIT is an AI-powered Virtual Try-On mobile application that enables users to virtually try on clothing using advanced deep learning models. The project consists of a React Native mobile app with TypeScript and a Python FastAPI backend.

## Development Commands

### Mobile App (React Native + Expo)
```bash
cd app
npm install                           # Install dependencies
npm start                            # Start Expo dev server
npm run android                      # Run on Android
npm run ios                         # Run on iOS
npx expo start -c                   # Start with cache cleared
```

### Backend (FastAPI + Python)
```bash
cd backend
python -m venv .venv                # Create virtual environment
source .venv/bin/activate           # Activate venv (Linux/Mac)
# .venv\Scripts\activate            # Activate venv (Windows)
pip install -r requirements.txt    # Install dependencies
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload  # Start dev server
```

### Testing
```bash
# Backend tests
cd backend
./run_tests.sh                     # Run all backend tests
PYTHONPATH=$(pwd) pytest tests/features/auth/  # Run specific feature tests

# Mobile app linting
cd app
npx prettier --write .             # Format code
npx eslint --fix .                 # Fix ESLint issues
```

### API Type Generation
```bash
cd app
npm run gen:types                   # Generate TypeScript types from OpenAPI spec
```

### Documentation
```bash
cd docs
./generate_docs.sh html            # Generate documentation
./generate_docs.sh serve           # Serve docs locally
```

### Build & Deploy
```bash
cd app
eas build --platform ios --profile development    # Development build
eas build --platform ios --profile production     # Production build
eas submit -p ios --latest                        # Submit to App Store
```

## Architecture & Code Organization

### Frontend Architecture (React Native)
- **Feature-based organization**: Each feature has its own folder under `app/src/features/`
- **Redux Toolkit**: Centralized state management with slices, thunks, and selectors
- **Navigation**: React Navigation with stack and tab navigators
- **Persistence**: Redux Persist for auth state, AsyncStorage for local data

### Key Frontend Patterns
```
features/
├── feature-name/
│   ├── components/           # Feature-specific components
│   ├── screens/             # Screen components
│   ├── navigation/          # Feature navigation
│   ├── services/            # API service functions
│   ├── slices/              # Redux slices
│   ├── thunks/              # Async Redux thunks
│   ├── selectors/           # Redux selectors
│   └── types/               # TypeScript types
```

### Backend Architecture (FastAPI)
- **Clean Architecture**: Repository pattern with service layer abstraction
- **Feature-based modules**: Each feature contains model, repo, service, route, and schema
- **Dependency Injection**: FastAPI's dependency system for database connections
- **Async/Await**: Full async support throughout the stack

### Key Backend Patterns
```
features/
├── feature-name/
│   ├── feature_model.py     # Database models
│   ├── feature_repo.py      # Data access layer
│   ├── feature_service.py   # Business logic
│   ├── feature_route.py     # API endpoints
│   └── feature_schema.py    # Pydantic schemas
```

### State Management
- **Redux Store Structure**: 
  - `auth`: Authentication state (persisted)
  - `onboarding`: User registration flow
  - `user`: User profile data
  - `body`: Virtual mannequin data
  - `clothing`: Clothing items
  - `tryon`: Virtual try-on results
  - `favorite`: Favorited items
  - `explorer`: Content discovery

### API Integration
- **Services**: Each feature has a service file that defines API calls
- **Types**: Auto-generated TypeScript types from OpenAPI spec
- **Error Handling**: Centralized error handling with apiError utils
- **Authentication**: JWT tokens with automatic refresh

## Development Guidelines

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/name`: New feature development
- `fix/name`: Bug fixes

### Commit Conventions
Follow [Conventional Commits](https://conventionalcommits.org):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code formatting
- `refactor:` Code restructuring
- `test:` Adding/modifying tests

### Code Style
- **TypeScript**: Strict mode enabled, all frontend code must be typed
- **Python**: Type hints required, follow FastAPI patterns
- **Naming**: camelCase for JS/TS, snake_case for Python
- **Icons**: Use MaterialCommunityIcons (not Feather icons)
- **Linting**: ESLint + Prettier for frontend, automatic formatting on save

### Key Technologies
- **Frontend**: React Native 0.79, Expo SDK 53, TypeScript 5.8, Redux Toolkit, React Navigation
- **Backend**: FastAPI, Python 3.10+, Motor (MongoDB), Pydantic v2
- **Database**: MongoDB with proper indexing
- **Storage**: AWS S3 for file management
- **Payment**: Stripe integration
- **AI/ML**: Replicate API for try-on models

### Testing Strategy
- **Backend**: Pytest with async support, comprehensive test coverage
- **Frontend**: Focus on critical business logic and navigation flows
- **Integration**: API endpoint testing with mocked external services

### Performance Considerations
- **React Native**: Use lazy loading, optimize bundle size, proper image handling
- **Backend**: Async operations, proper database indexing, efficient queries
- **Caching**: Redux state management, AsyncStorage for offline capability

### Security Practices
- **Authentication**: JWT tokens with secure storage
- **Environment Variables**: Never commit secrets, use `.env` files
- **Input Validation**: Pydantic schemas for backend, proper form validation frontend
- **API Security**: Rate limiting, proper CORS configuration

## Important Files & Directories

### Configuration Files
- `app/package.json`: Frontend dependencies and scripts
- `backend/requirements.txt`: Python dependencies
- `app/src/store/index.ts`: Redux store configuration
- `app/src/navigation/AppNavigator.tsx`: Main navigation structure
- `.cursorrules`: AI assistant configuration

### Entry Points
- `app/src/App.tsx`: React Native app root
- `backend/app/main.py`: FastAPI application
- `app/src/index.tsx`: App entry point

### Development Setup
- `backend/docker.compose.yaml`: Local development environment
- `app/eas.json`: Expo Application Services configuration
- `docs/`: Sphinx documentation for both frontend and backend

## API Endpoints
- **Development**: http://localhost:8000/api/v1
- **Documentation**: http://localhost:8000/api/v1/docs
- **OpenAPI Spec**: http://localhost:8000/api/v1/openapi.json

## Common Debugging Tips
- Check Redux DevTools for state management issues
- Use `console.log('FeatureName - debug info:', data)` format for debugging
- Backend logs available through uvicorn console output
- Use `dispatch(thunk).unwrap()` for proper async error handling in Redux
- Always refresh state after CRUD operations (e.g., `dispatch(fetchCurrentBody())`)