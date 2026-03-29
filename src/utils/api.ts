import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Injecte le token JWT automatiquement sur chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mig_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Types ---
export interface Marque {
  id: number;
  nom: string;
  logo?: string;
  type: string;
  description?: string;
  createdAt: string;
}

export interface Vehicule {
  id: number;
  marqueId: number;
  marque?: { id: number; nom: string; logo?: string };
  nom: string;
  prix: string;
  annee: string;
  carburant: string;
  transmission: string;
  couleur?: string;
  description?: string;
  image?: string;
  statut: 'disponible' | 'vendu' | 'reserve';
  createdAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  brand?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// --- Upload ---
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<{ url: string }>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.url;
};

// --- Auth ---
export const login = async (username: string, password: string): Promise<string> => {
  const { data } = await api.post('/auth/login', { username, password });
  return data.token;
};

// --- Marques ---
export const getMarques = () => api.get<Marque[]>('/marques').then(r => r.data);
export const addMarque = (data: Omit<Marque, 'id' | 'createdAt'>) => api.post<Marque>('/marques', data).then(r => r.data);
export const updateMarque = (id: number, data: Partial<Marque>) => api.put<Marque>(`/marques/${id}`, data).then(r => r.data);
export const deleteMarque = (id: number) => api.delete(`/marques/${id}`);

// --- Véhicules ---
export const getVehicules = (params?: { marqueId?: number; carburant?: string; statut?: string }) =>
  api.get<Vehicule[]>('/vehicules', { params }).then(r => r.data);
export const addVehicule = (data: Omit<Vehicule, 'id' | 'createdAt' | 'marque'>) => api.post<Vehicule>('/vehicules', data).then(r => r.data);
export const updateVehicule = (id: number, data: Partial<Vehicule>) => api.put<Vehicule>(`/vehicules/${id}`, data).then(r => r.data);
export const deleteVehicule = (id: number) => api.delete(`/vehicules/${id}`);

// --- Messages ---
export const sendMessage = (data: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>) => api.post<ContactMessage>('/messages', data).then(r => r.data);
export const getMessages = () => api.get<ContactMessage[]>('/messages').then(r => r.data);
export const markAsRead = (id: number) => api.patch(`/messages/${id}/read`);
export const deleteMessage = (id: number) => api.delete(`/messages/${id}`);

export default api;
