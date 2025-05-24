# `store` Folder

This folder manages the global state of the application.

## Purpose

Used to:
- Store globally accessible information (e.g., logged-in user, shopping cart).
- Share state across multiple screens or components.

## Typical Files

- **`authSlice.js`**: Manages user-related state (using Redux).
- **`cartSlice.js`**: Manages the shopping cart state.
- **`store.js`**: Configures the global store using Redux Toolkit or other state management libraries.

## Example

```javascript
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isLoggedIn: false },
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
```