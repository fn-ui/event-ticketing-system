import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  Ticket,
  User,
  X,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";
import logo from "../../assets/image3.png";

import { useAuth } from "../../contexts/AuthContext";

import { logoutUser } from "../../services/authService";

function Navbar() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const { user } = useAuth();

  const navigate = useNavigate();

  const handleLogout =
    async () => {
      try {
        await logoutUser();

        navigate("/login");
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
      <div className="container-width flex h-20 items-center justify-between px-6">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
            <img
              src={logo}
              alt="logo"
              className="h-10 w-10 object-contain"
            />
          </div>

          <div>
            <h1 className="text-xl font-black text-gray-900">
              Event Ticketing
            </h1>

            <p className="text-xs text-gray-500">
              Premium Booking System
            </p>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            to="/"
            className="font-semibold text-gray-700 transition hover:text-violet-700"
          >
            Home
          </Link>

          <Link
            to="/events"
            className="font-semibold text-gray-700 transition hover:text-violet-700"
          >
            Events
          </Link>

          {user && (
            <>
              <Link
                to="/dashboard"
                className="font-semibold text-gray-700 transition hover:text-violet-700"
              >
                Dashboard
              </Link>

              <Link
                to="/bookings"
                className="font-semibold text-gray-700 transition hover:text-violet-700"
              >
                Bookings
              </Link>

              <Link
                to="/profile"
                className="font-semibold text-gray-700 transition hover:text-violet-700"
              >
                Profile
              </Link>
            </>
          )}
        </nav>

        {/* RIGHT */}
        <div className="hidden items-center gap-4 lg:flex">
          {!user ? (
            <>
              <Link
                to="/login"
                className="secondary-btn"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="primary-btn"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="hidden text-right xl:block">
                <h3 className="font-bold text-gray-900">
                  {
                    user
                      ?.user_metadata
                      ?.full_name
                  }
                </h3>

                <p className="text-sm text-gray-500">
                  {user?.email}
                </p>
              </div>

              <button
                onClick={
                  handleLogout
                }
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 transition hover:bg-red-200"
              >
                <LogOut className="h-5 w-5 text-red-700" />
              </button>
            </div>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() =>
            setMobileOpen(
              !mobileOpen
            )
          }
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 lg:hidden"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white lg:hidden">
          <div className="container-width flex flex-col gap-4 px-6 py-6">
            <Link
              to="/"
              className="font-semibold text-gray-700"
            >
              Home
            </Link>

            <Link
              to="/events"
              className="font-semibold text-gray-700"
            >
              Events
            </Link>

            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 font-semibold text-gray-700"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>

                <Link
                  to="/bookings"
                  className="flex items-center gap-3 font-semibold text-gray-700"
                >
                  <CalendarDays className="h-5 w-5" />
                  Bookings
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-3 font-semibold text-gray-700"
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>

                <button
                  onClick={
                    handleLogout
                  }
                  className="flex items-center gap-3 font-semibold text-red-700"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            )}

            {!user && (
              <div className="flex flex-col gap-4 pt-4">
                <Link
                  to="/login"
                  className="secondary-btn w-full"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="primary-btn w-full"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;