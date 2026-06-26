import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/Home";

import Events from "../pages/Events";

import EventDetails from "../pages/EventDetails";

import Payments from "../pages/Payments";

import Dashboard from "../pages/Dashboard";

import Login from "../pages/Login";

import Register from "../pages/Register";

import Bookings from "../pages/Bookings";

import Profile from "../pages/Profile";

import NotFound from "../pages/NotFound";

import ProtectedRoute from "./ProtectedRoute";
//admin
import AdminDashboard from "../pages/AdminDashboard";

import AdminRoute from "./AdminRoute";

import AdminEvents from "../pages/admin/AdminEvents";

import AdminBookings from "../pages/admin/AdminBookings";

import AdminPayments from "../pages/admin/AdminPayments";

import AdminUsers from "../pages/admin/AdminUsers";

import AdminReports from "../pages/admin/AdminReports";

import AdminSettings from "../pages/admin/AdminSettings";


import PaypalSuccess from "../pages/PaypalSuccess";
import PaypalCancel from "../pages/PaypalCancel";

import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFailed from "../pages/PaymentFailed";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/events"
          element={<Events />}
        />

        <Route
          path="/events/:id"
          element={<EventDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* PROTECTED */}
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <AdminRoute>
              <AdminEvents />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <AdminBookings />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/payments"
          element={
            <AdminRoute>
              <AdminPayments />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

         <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <AdminReports />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminSettings />
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />

        <Route
          path="/paypal-success"
          element={<PaypalSuccess />}
        />

        <Route
          path="/paypal-cancel"
          element={<PaypalCancel />}
        />

        <Route
          path="/payment-success"
          element={<PaymentSuccess />}
        />

        <Route
          path="/payment-failed"
          element={<PaymentFailed />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/Home";

import Events from "../pages/Events";

import EventDetails from "../pages/EventDetails";

import Payments from "../pages/Payments";

import Dashboard from "../pages/Dashboard";

import Login from "../pages/Login";

import Register from "../pages/Register";

import Bookings from "../pages/Bookings";

import Profile from "../pages/Profile";

import NotFound from "../pages/NotFound";

import ProtectedRoute from "./ProtectedRoute";
//admin
import AdminDashboard from "../pages/AdminDashboard";

import AdminRoute from "./AdminRoute";

import AdminEvents from "../pages/admin/AdminEvents";

import AdminBookings from "../pages/admin/AdminBookings";

import AdminPayments from "../pages/admin/AdminPayments";

import AdminUsers from "../pages/admin/AdminUsers";

import AdminReports from "../pages/admin/AdminReports";

import AdminSettings from "../pages/admin/AdminSettings";


import PaypalSuccess from "../pages/PaypalSuccess";
import PaypalCancel from "../pages/PaypalCancel";

import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFailed from "../pages/PaymentFailed";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/events"
          element={<Events />}
        />

        <Route
          path="/events/:id"
          element={<EventDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* PROTECTED */}
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <AdminRoute>
              <AdminEvents />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <AdminBookings />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/payments"
          element={
            <AdminRoute>
              <AdminPayments />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

         <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <AdminReports />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminSettings />
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />

        <Route
          path="/paypal-success"
          element={<PaypalSuccess />}
        />

        <Route
          path="/paypal-cancel"
          element={<PaypalCancel />}
        />

        <Route
          path="/payment-success"
          element={<PaymentSuccess />}
        />

        <Route
          path="/payment-failed"
          element={<PaymentFailed />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;