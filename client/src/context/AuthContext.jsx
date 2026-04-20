import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'LOGOUT':
      return { ...state, user: null, loading: false, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: JSON.parse(userInfo) });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      return data;
    } catch (error) {
      let message = 'Login failed';
      if (!error.response) {
        message = 'Cannot connect to Server. Please ensure Backend and MongoDB are running.';
      } else {
        message = error.response.data?.message || 'Invalid Credentials';
      }
      dispatch({ type: 'SET_ERROR', payload: message });
      throw new Error(message);
    }
  }, []);

  const register = useCallback(async (name, email, password, age, weight, height, goal) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data } = await API.post('/auth/register', { name, email, password, age, weight, height, goal });
      // We don't save to localStorage immediately here because we want to show success message first
      return data;
    } catch (error) {
      let message = 'Registration failed';
      if (!error.response) {
        message = 'Cannot connect to Server. Please ensure Backend and MongoDB are running.';
      } else {
        message = error.response.data?.message || 'Registration failed';
      }
      dispatch({ type: 'SET_ERROR', payload: message });
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('userInfo');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const updateSession = useCallback((data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
    dispatch({ type: 'LOGIN_SUCCESS', payload: data });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, clearError, updateSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
