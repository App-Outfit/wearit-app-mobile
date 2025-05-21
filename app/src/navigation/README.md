# `navigation` Folder

This folder handles the navigation configuration of the app.

## Purpose

Navigation connects different screens and enables smooth transitions between them.

## Typical Files

- **`AppNavigator.js`**: Main navigation configuration (e.g., Stack or Tab navigation).
- **`AuthNavigator.js`**: Navigation for authentication-related screens.
- **`MainNavigator.js`**: Navigation for post-login screens.

## Example

```javascript
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
```