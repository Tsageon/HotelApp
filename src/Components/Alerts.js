import React, { createContext, useContext, useCallback } from "react";
import Swal from "sweetalert2";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const showAlert = useCallback((severity, message) => {
    Swal.fire({
      title: severity.charAt(0).toUpperCase() + severity.slice(1), 
      text: message,
      icon: severity,
      confirmButtonText: "OK",
      timer: 4000,
    });
  }, []);

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
    </AlertContext.Provider>
  );
};
