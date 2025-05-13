import axios from 'axios';

export function parseApiError(error: unknown): string {
    if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as { message?: string };
        return data.message ?? error.message;
    }

    if (error instanceof Error) {
        console.error(error.message);
        return error.message;
    }
    return 'Une erreur est survenue.';
}
