import api from "./axios";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// POST /api/auth/register - Register a new user
export const register = async (data: RegisterData): Promise<LoginResponse> => {
  const response = await api.post("/auth/register", data);

  // Save token to localStorage
  if (response.data.data?.token) {
    localStorage.setItem("authToken", response.data.data.token);
  }

  return response.data.data; // Extract nested data
};

// POST /api/auth/login - Login user
export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);

  // Save token to localStorage
  if (response.data.data?.token) {
    localStorage.setItem("authToken", response.data.data.token);
  }

  return response.data.data; // Extract nested data
};

// GET /api/auth/profile - Get user profile
export const getProfile = async (): Promise<User> => {
  const response = await api.get("/auth/profile");
  return response.data.data; // Extract nested data
};

// PUT /api/auth/profile - Update user profile
export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.put("/auth/profile", data);
  return response.data.data; // Extract nested data
};

// PUT /api/auth/profile - Upload avatar
export const uploadAvatar = async (file: File): Promise<User> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await api.put("/auth/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data; // Extract nested data
};

// Helper: Set auth token
export const setAuthToken = (token: string): void => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  localStorage.setItem("authToken", token);
};

// Helper: Remove auth token
export const removeAuthToken = (): void => {
  delete api.defaults.headers.common["Authorization"];
  localStorage.removeItem("authToken");
};

// Helper: Initialize auth from localStorage
export const initializeAuth = (): void => {
  const token = localStorage.getItem("authToken");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

// Helper: Logout user
export const logout = (): void => {
  removeAuthToken();
};

// Helper: Check if authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("authToken");
};
