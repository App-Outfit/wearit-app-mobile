/**
 * validateEmail - Validates the email format.
 *
 * This function checks if the provided email is in a valid format. It uses a regular expression to verify that the email contains
 * an '@' symbol, a domain name, and a valid top-level domain (TLD).
 *
 * @param email - The email address to validate.
 * @returns boolean - Returns `true` if the email is valid, otherwise `false`.
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
};

/**
 * validateUsername - Validates the username format.
 *
 * This function checks if the provided username meets the requirements. The username must be between 3 and 20 characters long
 * and can contain letters, digits, hyphens (-), and underscores (_).
 *
 * @param username - The username to validate.
 * @returns boolean - Returns `true` if the username is valid, otherwise `false`.
 */
export const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
};

/**
 * validatePassword - Validates the password strength.
 *
 * This function checks if the password is strong enough. The password must contain at least 8 characters, including at least
 * one letter, one number, and one special character (e.g., !@#$%^&*). The regex ensures the password follows a secure format.
 *
 * @param password - The password to validate.
 * @returns boolean - Returns `true` if the password is valid, otherwise `false`.
 */
export const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)\S{8,}$/;
    return passwordRegex.test(password);
};
