import axios from 'axios';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // include cookies in cross-origin requests
});

// No request interceptor needed for auth anymore
// Cookies are automatically sent

// Response interceptor for auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.log("Error:::",error);

            //   if (error.response.status === 404) {
            //     console.error("404 Not Found:", error);
            //   }

            if (error.response.status === 401) {
                // Optional: Redirect to login or show a modal
                if (typeof window !== 'undefined') {
                    window.location.href = "/"; // or show logout message
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;