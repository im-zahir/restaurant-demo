"use client";

import { createContext, useContext, useEffect, useState } from "react";

type CustomerAuthContextType = {
  customerEmail: string | null;
  login: (email: string) => void;
  logout: () => void;
  isLoaded: boolean;
};

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for existing session token in localStorage
    const savedEmail = localStorage.getItem("gourmet_customer_email");
    if (savedEmail) {
      setCustomerEmail(savedEmail);
    }
    setIsLoaded(true);
  }, []);

  const login = (email: string) => {
    localStorage.setItem("gourmet_customer_email", email);
    setCustomerEmail(email);
  };

  const logout = () => {
    localStorage.removeItem("gourmet_customer_email");
    setCustomerEmail(null);
  };

  return (
    <CustomerAuthContext.Provider value={{ customerEmail, login, logout, isLoaded }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
}
