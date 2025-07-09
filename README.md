# WearIT

AI-powered Virtual Try-On mobile application enabling users to virtually try on clothing using advanced deep learning models.

## Overview

WearIT leverages state-of-the-art computer vision and generative AI to provide a seamless virtual try-on experience. The platform combines React Native mobile app with a FastAPI backend, integrating multiple AI services for realistic clothing visualization.

## Tech Stack

**Frontend**
- React Native with Expo
- TypeScript for type safety
- Redux Toolkit for state management
- React Navigation for routing

**Backend**
- FastAPI for high-performance API
- Python 3.10+ with async support
- MongoDB for flexible data storage
- AWS S3 for cloud storage

**Infrastructure**
- Docker containerization
- Stripe for payment processing
- Comprehensive testing suite

## Prerequisites

- Node.js 16+ and npm
- Python 3.10+
- MongoDB instance
- AWS S3 bucket
- Replicate API account
- Stripe account

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/App-Outfit/wearit-app-mobile.git
cd wearit-app-mobile
```

### 2. Environment Setup
```bash
cp .env.example .env
# Configure your API keys and endpoints
```

### 3. Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**API Endpoint**: http://localhost:8000/api/v1
**API Documentation**: http://localhost:8000/api/v1/docs

### 4. Mobile App Setup
```bash
cd app
npm install
npm start
```

## Development

### Code Quality
```bash
# Linting and formatting
npm run lint
npm run format
```

## Deployment

### Development Build
```bash
eas build --platform ios --profile development
npx expo start -c
```

### Production Build
```bash
eas build --platform ios --profile production
eas submit -p ios --latest
```

## Documentation

Generate and serve documentation locally:
```bash
cd docs
./generate_docs.sh html      # Generate documentation
./generate_docs.sh serve     # Development server
```

**Online Documentation**: https://wearit-app-mobile.readthedocs.io

## Architecture

The application follows a microservices architecture with clear separation of concerns:

- **Feature-based organization** for both frontend and backend
- **Repository pattern** for data access
- **Service layer** for business logic
- **Dependency injection** for testability
- **Async/await** for performance optimization

## Contributing

### Creating a Feature Branch

1. **Update your local repository:**
   ```bash
   git fetch
   git checkout develop
   git pull origin develop
   ```

2. **Create your feature branch:**
   ```bash
   git checkout -b feature/nom-de-la-feature
   ```
   Replace `feature/nom-de-la-feature` with your feature name.

3. **Work on your branch and push:**
   ```bash
   git add .
   git commit -m "feat: your commit message"
   git push origin feature/nom-de-la-feature
   ```

### Development Guidelines

1. Always create feature branches from `develop` (not from `main`)
2. Follow [Conventional Commits](https://conventionalcommits.org) for commit messages
3. Ensure all tests pass and code quality standards are met
4. Submit a pull request with comprehensive description

## License

0BSD License - see LICENSE file for details
