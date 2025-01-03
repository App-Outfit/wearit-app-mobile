# CHANGELOG

## 2025-01-02
- **ADD**(`Signup Service`): Add signup feature in mobile app.
  - **[src/services](./src/services)**
    - [signupService.tsx](./src/services/signupService.tsx): Add function which call to backend.
- **ADD**(`Backend`): Fix some error when the secret is not provided + Handling algorithm mode.
  - **[backend](./backend)**
    - [main.py](./backend/main.py)
- **ADD**(`Backend`): Add a Dockerfile for further deployments.
  - **[backend](./backend)**
    - [Dockerfile](./backend/Dockerfile): Begin to add a docker file for deploying API in cloud service.

