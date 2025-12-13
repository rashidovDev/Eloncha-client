import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "../types/types";
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { GET } from "./api/api";

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  refetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
const [user, setUser] = useState<User | null>(null);
const [token, setToken] = useState<string | null>(null);
const navigate = useNavigate();

  useEffect(() => {
    // Load from localStorage if available
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("user_access_token", token);
    localStorage.setItem("tokenTime", JSON.stringify(Date.now()));
  };

  const refetchUser = async () => {
    try {
      const response = await GET('user/auth');
      if (response) {
        setUser(response);
            localStorage.setItem("user", JSON.stringify(response));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

   const loginAdmin = (userData: User, token: string) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access_token", token);
    localStorage.setItem("tokenTime", JSON.stringify(Date.now()));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("user_access_token");
    localStorage.removeItem("tokentime");
    navigate("/")
  };
  

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};