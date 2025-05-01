// src/utils/apiError.ts
import axios, { AxiosError } from 'axios';

interface FastApiError {
    detail?: unknown;
    message?: string;
}

export function parseApiError(error: unknown): string {
    // 1) est-ce une erreur Axios ?
    if (axios.isAxiosError(error)) {
        // on sait que c'est un AxiosError
        const axiosErr = error as AxiosError<FastApiError>;

        // 2) extrait data et la caste
        const data = axiosErr.response?.data as FastApiError | undefined;
        const detail = data?.detail;

        // 3) validation errors FastAPI (tableau de { msg })
        if (Array.isArray(detail)) {
            // « detail » est un tableau, on récupère chaque msg
            return detail
                .map((d: any) =>
                    typeof d.msg === 'string' ? d.msg : JSON.stringify(d),
                )
                .join(', ');
        }

        // 4) message métier dans detail
        if (typeof detail === 'string') {
            return detail;
        }

        // 5) fallback sur data.message ou error.message
        if (typeof data?.message === 'string') {
            return data.message;
        }

        return error.message;
    }

    // pas une AxiosError → message générique
    return 'Une erreur est survenue. Veuillez réessayer.';
}
