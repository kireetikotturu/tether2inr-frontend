import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ADMIN_EMAIL = "venombar122@gmail.com";

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user || user.role !== "admin" || user.email !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  return children;
}
