// ============================================
// FILE: src/api/axios.config.ts
// ============================================
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with base config
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============================================
// REQUEST INTERCEPTOR (Before request is sent)
// ============================================
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Add auth token
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add any other headers
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ============================================
// RESPONSE INTERCEPTOR (After response received)
// ============================================
api.interceptors.response.use(
    // Success response (2XX)
    (response) => {
        return response;
    },

    // Error response (4XX, 5XX)
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            const data: any = error.response.data;

            switch (status) {
                case 400:
                    toast.error(data?.message || 'Invalid request');
                    break;

                case 401:
                    toast.error('Please login to continue');
                    // Clear token and redirect to login
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;

                case 403:
                    toast.error('You do not have permission');
                    break;

                case 404:
                    toast.error(data?.message || 'Resource not found');
                    break;

                case 422:
                    // Validation errors
                    toast.error(data?.message || 'Validation failed');
                    break;

                case 429:
                    toast.error('Too many requests. Please try again later.');
                    break;

                case 500:
                    toast.error('Server error. Please try again later.');
                    break;

                case 502:
                case 503:
                    toast.error('Service unavailable. Please try again.');
                    break;

                default:
                    toast.error(data?.message || 'An error occurred');
            }
        } else if (error.request) {
            // Request was made but no response received
            toast.error('Network error. Please check your connection.');
        } else {
            // Something else happened
            toast.error('An unexpected error occurred');
        }

        return Promise.reject(error);
    }
);

// ============================================
// FILE: src/types/api.types.ts
// ============================================
export interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string[]>; // For validation errors
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

// ============================================
// FILE: src/hooks/useApi.ts
// ============================================
import { useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface UseApiOptions {
    showErrorToast?: boolean;
    showSuccessToast?: boolean;
    successMessage?: string;
}

export function useApi<T>(options: UseApiOptions = {}) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = async (
        apiCall: () => Promise<any>,
        customOptions?: UseApiOptions
    ): Promise<T | null> => {
        const opts = { ...options, ...customOptions };

        try {
            setLoading(true);
            setError(null);

            const response = await apiCall();
            const result = response.data;

            setData(result);

            // Show success toast if needed
            if (opts.showSuccessToast) {
                toast.success(opts.successMessage || 'Success!');
            }

            return result;

        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            let errorMessage = 'An unexpected error occurred';

            if (axiosError.response?.data?.message) {
                errorMessage = axiosError.response.data.message;
            }

            setError(errorMessage);

            // Toast already shown by interceptor, but you can customize here
            if (opts.showErrorToast) {
                toast.error(errorMessage);
            }

            return null;

        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setData(null);
        setError(null);
        setLoading(false);
    };

    return { data, loading, error, execute, reset };
}

// ============================================
// FILE: src/services/userService.ts
// ============================================
import { api } from '../api/axios.config';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export const userService = {
    // Get all users
    async getUsers() {
        const response = await api.get<User[]>('/users');
        return response.data;
    },

    // Get user by ID
    async getUserById(id: string) {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    },

    // Create user
    async createUser(userData: Omit<User, 'id'>) {
        const response = await api.post<User>('/users', userData);
        return response.data;
    },

    // Update user
    async updateUser(id: string, userData: Partial<User>) {
        const response = await api.put<User>(`/users/${id}`, userData);
        return response.data;
    },

    // Delete user
    async deleteUser(id: string) {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },
};

// ============================================
// FILE: Example Component Usage
// ============================================
import { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { userService, User } from '../services/userService';

function UserList() {
    const { data: users, loading, error, execute } = useApi<User[]>();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        await execute(() => userService.getUsers());
    };

    const handleCreateUser = async (userData: Omit<User, 'id'>) => {
        const result = await execute(
            () => userService.createUser(userData),
            {
                showSuccessToast: true,
                successMessage: 'User created successfully!',
            }
        );

        if (result) {
            loadUsers(); // Refresh list
        }
    };

    const handleDeleteUser = async (id: string) => {
        const confirmed = window.confirm('Are you sure?');
        if (!confirmed) return;

        const result = await execute(
            () => userService.deleteUser(id),
            {
                showSuccessToast: true,
                successMessage: 'User deleted successfully!',
            }
        );

        if (result) {
            loadUsers(); // Refresh list
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: { error } </div>;
    if (!users) return <div>No users found </div>;

    return (
        <div>
        <h2>Users </h2>
        < button onClick = {() => handleCreateUser({ name: 'New', email: 'new@test.com', role: 'user' })
}>
    Add User
        </button>
{
    users.map((user) => (
        <div key= { user.id } >
        <span>{ user.name } </span>
        < button onClick = {() => handleDeleteUser(user.id)}> Delete </button>
            </div>
      ))}
</div>
  );
}

// ============================================
// FILE: Advanced Error Handling Example
// ============================================
import { AxiosError } from 'axios';

function UserProfile({ userId }: { userId: string }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadUser();
    }, [userId]);

    const loadUser = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await userService.getUserById(userId);
            setUser(data);

        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;

            // Handle specific error cases
            if (axiosError.response?.status === 404) {
                setError('User not found');
            } else if (axiosError.response?.status === 403) {
                setError('You do not have permission to view this user');
            } else {
                setError('Failed to load user');
            }

            // Error toast already shown by interceptor

        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: { error } </div>;
    if (!user) return null;

    return (
        <div>
        <h2>{ user.name } </h2>
        < p > { user.email } </p>
        </div>
    );
}

// ============================================
// FILE: Form with Validation Errors
// ============================================
import { useState } from 'react';
import { AxiosError } from 'axios';

function CreateUserForm() {
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors({});

        try {
            setLoading(true);
            await userService.createUser({ ...formData, role: 'user' });
            toast.success('User created!');
            setFormData({ name: '', email: '' });

        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;

            // Handle validation errors (422)
            if (axiosError.response?.status === 422) {
                const errors = axiosError.response.data.errors || {};

                // Convert array of errors to first error per field
                const fieldErrors: Record<string, string> = {};
                Object.keys(errors).forEach(key => {
                    fieldErrors[key] = errors[key][0]; // First error message
                });

                setValidationErrors(fieldErrors);
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit= { handleSubmit } >
        <div>
        <input
          value={ formData.name }
    onChange = {(e) => setFormData({ ...formData, name: e.target.value })
}
placeholder = "Name"
    />
{
    validationErrors.name && (
        <span className="text-red-600"> { validationErrors.name } </span>
        )
}
    </div>

    < div >
    <input
          value={ formData.email }
onChange = {(e) => setFormData({ ...formData, email: e.target.value })}
placeholder = "Email"
    />
{
    validationErrors.email && (
        <span className="text-red-600"> { validationErrors.email } </span>
        )
}
    </div>

    < button type = "submit" disabled = { loading } >
        { loading? 'Creating...': 'Create User' }
        </button>
        </form>
  );
}

// ============================================
// AXIOS ERROR STRUCTURE
// ============================================
/*
AxiosError {
  message: "Request failed with status code 404",
  name: "AxiosError",
  code: "ERR_BAD_REQUEST",
  
  config: { ... }, // Request config
  
  request: { ... }, // Original request
  
  response: {
    data: {
      message: "User not found",
      errors: {
        email: ["Email already exists"]
      }
    },
    status: 404,
    statusText: "Not Found",
    headers: { ... }
  }
}
*/

// ============================================
// TESTING AXIOS CALLS
// ============================================
import { describe, it, expect, vi } from 'vitest';
import { api } from './axios.config';
import { userService } from '../services/userService';

// Mock axios
vi.mock('axios');

describe('User Service with Axios', () => {
    it('should fetch users successfully', async () => {
        const mockUsers = [{ id: '1', name: 'John', email: 'john@test.com', role: 'user' }];

        vi.spyOn(api, 'get').mockResolvedValue({ data: mockUsers });

        const users = await userService.getUsers();

        expect(users).toEqual(mockUsers);
        expect(api.get).toHaveBeenCalledWith('/users');
    });

    it('should handle 404 error', async () => {
        const error = {
            response: {
                status: 404,
                data: { message: 'User not found' }
            }
        };

        vi.spyOn(api, 'get').mockRejectedValue(error);

        await expect(userService.getUserById('999')).rejects.toEqual(error);
    });

    it('should handle network error', async () => {
        const error = {
            message: 'Network Error',
            request: {}
        };

        vi.spyOn(api, 'get').mockRejectedValue(error);

        await expect(userService.getUsers()).rejects.toEqual(error);
    });
});

