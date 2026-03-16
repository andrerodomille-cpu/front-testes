import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PermissionContextType {
  allowedRoutes: string[];
  setAllowedRoutes: (routes: string[]) => void;
}

const PermissionContext = createContext<PermissionContextType>({
  allowedRoutes: [],
  setAllowedRoutes: () => { },
});

export function PermissionProvider({ children }: { children: ReactNode }) {
  const [allowedRoutes, setAllowedRoutesState] = useState<string[]>(() => {
    const stored = localStorage.getItem("allowedRoutes");
    return stored ? JSON.parse(stored) : [];
  });

  const setAllowedRoutes = (routes: string[]) => {
    setAllowedRoutesState(routes);
    localStorage.setItem("allowedRoutes", JSON.stringify(routes));
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("allowedRoutes");
      setAllowedRoutesState(stored ? JSON.parse(stored) : []);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <PermissionContext.Provider value={{ allowedRoutes, setAllowedRoutes }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermission() {
  return useContext(PermissionContext);
}
