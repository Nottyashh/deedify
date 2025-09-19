import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: {
    email: string;
    password: string;
    role: 'INVESTOR' | 'LISTER';
    walletAddress?: string;
  }) => api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getProfile: () => api.get('/auth/profile'),
  
  updateProfile: (data: { walletAddress?: string }) =>
    api.post('/auth/profile', data),
};

// Listings API
export const listingsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minSize?: number;
    maxSize?: number;
  }) => api.get('/listings', { params }),
  
  getPublic: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minSize?: number;
    maxSize?: number;
  }) => api.get('/listings/public', { params }),
  
  getById: (id: string) => api.get(`/listings/${id}`),
  
  create: (data: {
    title: string;
    description: string;
    locationText: string;
    geoJson?: any;
    parcelSize: number;
    coordinatePolicy: boolean;
    coordinatePolicyNote?: string;
    totalShares: number;
    pricePerShare: number;
  }) => api.post('/listings', data),
  
  getShares: (id: string) => api.get(`/listings/${id}/shares`),
  
  getValuation: (id: string) => api.get(`/listings/${id}/valuation`),
};

// Orders API
export const ordersApi = {
  create: (data: {
    listingId: string;
    fractions: number;
  }) => api.post('/orders', data),
  
  pay: (orderId: string) => api.post(`/orders/${orderId}/pay`),
  
  getUserOrders: (params?: { page?: number; limit?: number }) =>
    api.get('/marketplace/orders', { params }),
  
  getById: (id: string) => api.get(`/marketplace/orders/${id}`),
};

// Holdings API
export const holdingsApi = {
  getUserHoldings: (userId?: string, params?: { page?: number; limit?: number }) =>
    api.get('/holdings', { params: { userId, ...params } }),
};

// Marketplace API
export const marketplaceApi = {
  listShare: (data: { shareMint: string; price: number }) =>
    api.post('/marketplace/list', data),
  
  buyShare: (data: { shareMint: string; buyerWallet: string }) =>
    api.post('/marketplace/buy', data),
  
  sellShare: (data: { shareMint: string; price: number }) =>
    api.post('/marketplace/sell', data),
  
  cancelOrder: (data: { orderId: string }) =>
    api.post('/marketplace/cancel', data),
  
  getListings: (params?: { page?: number; limit?: number }) =>
    api.get('/marketplace/listings', { params }),
  
  getStats: () => api.get('/marketplace/stats'),
};

export default api;