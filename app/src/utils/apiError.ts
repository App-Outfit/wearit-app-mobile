// src/utils/apiError.ts
import axios, { AxiosError } from 'axios';

interface FastApiError {
    detail?: unknown;
    message?: string;
}

export function parseApiError(error: unknown): string {
    if (!axios.isAxiosError(error)) {
        return 'Une erreur est survenue. Veuillez réessayer.';
    }

    const axiosErr = error as AxiosError<FastApiError>;
    const data = axiosErr.response?.data;
    const detail = data?.detail;

    // 1) Erreurs de validation FastAPI : tableau de { loc, msg, type }
    if (Array.isArray(detail)) {
        return detail
            .map((d) =>
                typeof (d as any).msg === 'string'
                    ? (d as any).msg
                    : JSON.stringify(d),
            )
            .join(', ');
    }

    // 2) Message métier dans `detail`
    if (typeof detail === 'string') {
        return detail;
    }

    // 3) Fallback sur `data.message`
    if (typeof data?.message === 'string') {
        return data.message;
    }

    // 4) Dernier ressort : error.message
    return error.message;
}
