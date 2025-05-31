const API_URL = "https://myndedge.onrender.com";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    _id: string;
    username: string;
    email: string;
    id?: string;
  };
  token?: string;
  message?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Sending login request to:', `${API_URL}/api/auth/login`);
      console.log('With credentials:', { email: credentials.email, password: '******' });
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      
      const data = await response.json();
      console.log('Login response:', data);
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Login failed',
        };
      }
      
      // Ensure the response format matches what we expect
      return {
        success: true,
        user: {
          _id: data.user.id || data.user._id,
          username: data.user.username,
          email: data.user.email
        },
        token: data.token,
      };
    } catch (error) {
      console.error('Network error during login:', error);
      return {
        success: false,
        message: 'Network error',
      };
    }
  },
  
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Registration failed',
        };
      }
      
      return {
        success: true,
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Network error',
      };
    }
  },
  
  async logout(): Promise<boolean> {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      return true;
    } catch (error) {
      return false;
    }
  },
  
  async checkAuthStatus(): Promise<AuthResponse> {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false };
    }
    
    try {
      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        return { success: false };
      }
      
      const data = await response.json();
      return {
        success: true,
        user: data,
      };
    } catch (error) {
      console.error('Auth status check error:', error);
      return { success: false };
    }
  }
};
