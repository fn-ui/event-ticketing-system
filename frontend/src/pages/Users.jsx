import {
  Search,
  UserCircle2,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";

function Users() {
  const users = [
    {
      id: 1,
      name: "Faith Njeri",
      email: "faith@gmail.com",
      role: "Admin",
    },
    {
      id: 2,
      name: "Brian Otieno",
      email: "brian@gmail.com",
      role: "Customer",
    },
    {
      id: 3,
      name: "David Mwangi",
      email: "david@gmail.com",
      role: "Customer",
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">
          Users Management
        </h1>

        <p className="mt-3 text-lg text-gray-500">
          Manage all registered users.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm">
        <Search className="h-5 w-5 text-gray-400" />

        <input
          type="text"
          placeholder="Search users..."
          className="w-full outline-none"
        />
      </div>

      {/* Users Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-3xl bg-white p-8 shadow-sm"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-violet-100">
                <UserCircle2 className="h-14 w-14 text-violet-700" />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                {user.name}
              </h2>

              <p className="mt-2 text-gray-500">
                {user.email}
              </p>

              <span className="mt-5 rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
                {user.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default Users;