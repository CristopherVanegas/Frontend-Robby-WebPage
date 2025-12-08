export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  active: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
