import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  CreditCard,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  logoutUser,
} from "../../services/authService";

function AdminSidebar() {
  const navigate =
    useNavigate();

  const handleLogout =
    async () => {
      await logoutUser();

      navigate("/login");
    };

  const menuItems = [
    {
      title: "Dashboard",
      icon:
        LayoutDashboard,
      path:
        "/admin",
    },

    {
      title: "Events",
      icon:
        CalendarDays,
      path:
        "/admin/events",
    },

    {
      title: "Bookings",
      icon: Ticket,
      path:
        "/admin/bookings",
    },

    {
      title: "Payments",
      icon:
        CreditCard,
      path:
        "/admin/payments",
    },

    {
      title: "Users",
      icon: Users,
      path:
        "/admin/users",
    },

    {
      title: "Reports",
      icon:
        BarChart3,
      path:
        "/admin/reports",
    },

    {
      title: "Settings",
      icon:
        Settings,
      path:
        "/admin/settings",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-72 flex-col bg-[#0B1120] text-white">
      {/* LOGO */}
      <div className="border-b border-white/10 p-8">
        <h2 className="text-3xl font-black">
          EventHub Admin
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Event Ticketing
          System
        </p>
      </div>

      {/* MENU */}
      <nav className="flex-1 p-6">
        <div className="space-y-3">
          {menuItems.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <NavLink
                  key={
                    item.title
                  }
                  to={
                    item.path
                  }
                  className={({
                    isActive,
                  }) =>
                    `flex items-center gap-4 rounded-2xl px-5 py-4 text-lg font-semibold transition ${
                      isActive
                        ? "bg-violet-700 text-white"
                        : "text-slate-300 hover:bg-white/5"
                    }`
                  }
                >
                  <Icon className="h-6 w-6" />

                  {
                    item.title
                  }
                </NavLink>
              );
            }
          )}
        </div>
      </nav>

      {/* LOGOUT */}
      <div className="p-6">
        <button
          onClick={
            handleLogout
          }
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500 px-6 py-4 font-bold text-white transition hover:bg-red-600"
        >
          <LogOut className="h-5 w-5" />

          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;