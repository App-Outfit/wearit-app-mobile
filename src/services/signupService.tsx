// TODO Implement a new function which will add a new registered user to the Mongo database
// create an axios post request to the backend to add a new user to the databaseimport axios from 'axios';
import axios from 'axios';
const BASE_URL = 'http://192.168.1.18:8000'; // TODO: Change this to the server's IP address because it hardcoded to the local IP address
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
        let objError = error as any; // Avoiding typescript error
        if (objError.response) {
            if (objError.response.status === 400) {
                if (objError.response.data && objError.response.data.detail) {
                    console.error(objError.response.data.detail);
                    return objError.response;
                } else {
                    console.error('Bad request', objError.response.data);
                }
            } else if (objError.response.status === 401) {
                console.error('signUpUser: Unauthorized');
            } else if (objError.response.status === 403) {
                console.error('Forbidden');
            } else if (objError.response.status === 404) {
                console.error('Not found');
            } else if (objError.response.status === 500) {
                console.error('Internal server error');
            }
        } else if (objError.request) {
            console.error('Error request:', objError.request);
        }
        return null;
    }
}

export { signUpUser };
