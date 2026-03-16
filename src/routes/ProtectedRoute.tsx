import { Navigate, useLocation } from "react-router-dom";
import { usePermission } from "@/contexts/PermissionContext";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  path: string;
}


export function ProtectedRoute({ children, path }: ProtectedRouteProps) {
  const { allowedRoutes } = usePermission();
  const location = useLocation();

  if (!allowedRoutes.includes(path)) {
    return <Navigate to="/nao-autorizado" state={{ from: location }} replace />;
  }
  useEffect(() => {
  }, [allowedRoutes]);
  
  return children;
}
