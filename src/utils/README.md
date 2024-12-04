# `utils` Folder

This folder contains utility functions, constants, and custom hooks.

## Purpose

Utilities are independent functions or helpers that do not depend on the app's context. They help avoid code duplication.

## Typical Files

- **`validation.js`**: Functions for validating user input (e.g., email, password).
- **`constants.js`**: Shared constants used throughout the app.
- **`hooks/`**: Custom hooks (e.g., `useAuth`, `useFetch`).

## Example

A simple email validation function:

```javascript
export const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};
```