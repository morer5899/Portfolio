import React, { createContext, useState, useContext, useEffect } from "react";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Check localStorage on initial load
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken");
      const adminStatus = localStorage.getItem("isAdmin");

      if (token && adminStatus === "true") {
        setAdminToken(token);
        setIsAdmin(true);
      }
      setIsLoading(false); // Set loading to false after check
    };

    checkAuth();
  }, []);

  const login = (token) => {
    setAdminToken(token);
    setIsAdmin(true);
    localStorage.setItem("adminToken", token);
    localStorage.setItem("isAdmin", "true");
  };

  const logout = () => {
    setAdminToken(null);
    setIsAdmin(false);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
  };

  return (
    <AdminContext.Provider value={{ isAdmin, adminToken, login, logout, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
};