import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({
  children,
}) {
  const { user, loading } =
    useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-3xl font-black text-violet-700">
          Loading...
        </h1>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate to="/login" />
    );
  }

  return children;
}

export default ProtectedRoute;