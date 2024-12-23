import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useUserStore from "../store/store";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  // Get the token from the store
  const token = useUserStore((state) => state.user?.token);

  return token ? <>{children}</> : <Navigate to="/login" replace />;
}
