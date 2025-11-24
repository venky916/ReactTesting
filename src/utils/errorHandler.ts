
export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public code?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export async function handleApiError(response: Response) {
    const data = await response.json().catch(() => ({}));

    // 4XX - Client errors
    if (response.status >= 400 && response.status < 500) {
        switch (response.status) {
            case 400:
                throw new ApiError(400, data.message || 'Invalid request');
            case 401:
                throw new ApiError(401, 'Please login to continue');
            case 403:
                throw new ApiError(403, 'You do not have permission');
            case 404:
                throw new ApiError(404, 'Resource not found');
            default:
                throw new ApiError(response.status, data.message || 'Request failed');
        }
    }

    // 5XX - Server errors
    if (response.status >= 500) {
        throw new ApiError(
            response.status,
            'Server error. Please try again later.'
        );
    }
}