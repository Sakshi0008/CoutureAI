import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Define response types
interface AuthResponse {
  token: string;
  message: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

interface ImageResponse {
  _id: string;
  userId: string;
  imageUrl: string;
  prompt: string;
  fabric: string;
  style: string;
  occasion: string;
  filters: Record<string, any>;
  isPublic: boolean;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  register: async (userData: { fullName: string; email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    try {
      console.log('Login request payload:', {
        email: credentials.email,
        hasPassword: !!credentials.password,
        passwordLength: credentials.password?.length || 0
      });

      // Log the actual request being made
      const requestConfig = {
        url: '/users/login',
        method: 'post',
        data: credentials,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      console.log('Making login request:', requestConfig);

      const response = await api.post<AuthResponse>('/users/login', credentials);
      console.log('Login response:', response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        request: error.config?.data
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/users/profile');
    return response.data;
  },
};

// Images API calls
export const imagesAPI = {
  createImage: async (imageData: FormData): Promise<ImageResponse> => {
    const response = await api.post<ImageResponse>('/images', imageData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getPublicImages: async (): Promise<ImageResponse[]> => {
    const response = await api.get<ImageResponse[]>('/images');
    return response.data;
  },

  getUserImages: async (): Promise<ImageResponse[]> => {
    const response = await api.get<ImageResponse[]>('/images/my-images');
    return response.data;
  },

  likeImage: async (imageId: string): Promise<ImageResponse> => {
    const response = await api.put<ImageResponse>(`/images/${imageId}/like`);
    return response.data;
  },

  deleteImage: async (imageId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/images/${imageId}`);
    return response.data;
  },
}; 