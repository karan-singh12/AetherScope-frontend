import api from './api';
import useToast from '../hooks/useToast';

const STORAGE_KEY = 'llm_auth_token';

export const saveAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, token);
  }
};

export const getAuthToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(STORAGE_KEY);
};

export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

export const signup = async (email: string, password: string) => {
  const res = await api.post('/api/auth/signup', { email, password });
  const token = res.data.data?.token;
  if (token) {
    saveAuthToken(token);
  }
  return res.data;
};

export const login = async (email: string, password: string) => {
  const res = await api.post('/api/auth/login', { email, password });
  const token = res.data.data?.token;
  if (token) {
    saveAuthToken(token);
  }
  return res.data;
};

export const logout = () => {
  clearAuthToken();
};

export const getProfile = async () => {
  const res = await api.get('/api/auth/profile');
  return res.data.data;
};

export const updateProfile = async (name: string, email: string) => {
  const res = await api.put('/api/auth/profile', { name, email });
  return res.data.data;
};
