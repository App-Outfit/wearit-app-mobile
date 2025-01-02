// TODO Implement a new function which will add a new registered user to the Mongo database
// create an axios post request to the backend to add a new user to the databaseimport axios from 'axios';
import axios from 'axios';
const BASE_URL = 'http://192.168.1.18:8000';
const AUTH_URL = `${BASE_URL}/auth/signup`;
const authAPI = axios.create({
    baseURL: BASE_URL,
});

async function signUpUser(
    email: string | undefined,
    password: string | undefined,
    name: string | undefined,
) {
    try {
        if (!email || !password || !name) {
            console.error('Missing email, password or name');
            return null;
        }
        console.log('Signing up user:', email);
        const response = await authAPI.post('api/auth/signup', {
            email: email,
            password: password,
            name: name,
        });
        if (!response) {
            console.error('No response from server');
            return null;
        }
        return response;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                console.error('Bad request', error.response.data);
            } else if (error.response.status === 401) {
                console.error('Unauthorized');
            } else if (error.response.status === 403) {
                console.error('Forbidden');
            } else if (error.response.status === 404) {
                console.error('Not found');
            } else if (error.response.status === 500) {
                console.error('Internal server error');
            }
        } else if (error.request) {
            console.error('Error request:', error.request);
        }
        return null;
    }
}

export { signUpUser };
