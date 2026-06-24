import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../contexts/AuthContext";

function AdminRoute({
  children,
}) {
  const {
    user,
    profile,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-violet-200 border-t-violet-700" />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    profile?.role !==
    "admin"
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}

export default AdminRoute;