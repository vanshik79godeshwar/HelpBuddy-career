// context/AuthContext.tsx
'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface WorkerInfo {
  fullName?: string;
  email?: string;
  isApproved?: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  worker: WorkerInfo | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [worker, setWorker] = useState<WorkerInfo | null>(null);

  // Restore authentication state on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds

        // Check if token is expired
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          // Token expired
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setWorker(null);
          return;
        }

        // Set worker info and mark as logged in
        const workerInfo: WorkerInfo = {
          fullName: decodedToken.fullName || '',
          email: decodedToken.email || '',
          isApproved: decodedToken.isApproved || false,
        };
        setWorker(workerInfo);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsLoggedIn(false);
        setWorker(null);
      }
    } else {
      setIsLoggedIn(false);
      setWorker(null);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const login = (token: string) => {
    try {
      const decodedToken: any = jwtDecode(token);
      localStorage.setItem('token', token); // Save token in localStorage
      const workerInfo: WorkerInfo = {
        fullName: decodedToken.fullName || '',
        email: decodedToken.email || '',
        isApproved: decodedToken.isApproved || false,
      };
      setWorker(workerInfo);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error decoding token during login:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); // Clear token from localStorage
    setIsLoggedIn(false);
    setWorker(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, worker, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // console.log("contest : ", context);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};