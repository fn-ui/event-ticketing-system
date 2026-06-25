import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/dashboard/AdminLayout";

import {
  Mail,
  Search,
  Shield,
  Trash2,
  User,
  Users,
} from "lucide-react";

import {
  deleteUserProfile,
  getAllUsers,
  updateUserRole,
} from "../../services/userService";

function AdminUsers() {
  const [users, setUsers] =
    useState([]);

  const [filteredUsers, setFilteredUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredUsers(
        users
      );

      return;
    }

    const filtered =
      users.filter(
        (user) =>
          user.full_name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          user.email
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          user.role
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    setFilteredUsers(
      filtered
    );
  }, [search, users]);

  async function fetchUsers() {
    try {
      const data =
        await getAllUsers();

      setUsers(
        data || []
      );

      setFilteredUsers(
        data || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(
    userId,
    role
  ) {
    try {
      await updateUserRole(
        userId,
        role
      );

      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleDelete(
    userId
  ) {
    const confirmDelete =
      window.confirm(
        "Delete this user?"
      );

    if (!confirmDelete)
      return;

    try {
      await deleteUserProfile(
        userId
      );

      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  }

  const admins =
    useMemo(() => {
      return users.filter(
        (user) =>
          user.role ===
          "admin"
      ).length;
    }, [users]);

  const normalUsers =
    useMemo(() => {
      return users.filter(
        (user) =>
          user.role ===
          "user"
      ).length;
    }, [users]);

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-5xl font-black text-gray-900">
              Users
            </h1>

            <p className="mt-3 text-lg text-gray-500">
              Manage all registered
              platform users.
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="input-field pl-14"
            />
          </div>
        </div>

        {/* STATS */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* TOTAL USERS */}
          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-500">
                  Total Users
                </p>

                <h2 className="mt-4 text-4xl font-black text-gray-900">
                  {
                    users.length
                  }
                </h2>
              </div>

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
                <Users className="h-10 w-10" />
              </div>
            </div>
          </div>

          {/* ADMINS */}
          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-500">
                  Admins
                </p>

                <h2 className="mt-4 text-4xl font-black text-gray-900">
                  {admins}
                </h2>
              </div>

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-blue-700">
                <Shield className="h-10 w-10" />
              </div>
            </div>
          </div>

          {/* USERS */}
          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-500">
                  Customers
                </p>

                <h2 className="mt-4 text-4xl font-black text-gray-900">
                  {
                    normalUsers
                  }
                </h2>
              </div>

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100 text-green-700">
                <User className="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-[32px] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                    User
                  </th>

                  <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                    Email
                  </th>

                  <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                    Role
                  </th>

                  <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                    Joined
                  </th>

                  <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-8 py-14 text-center text-gray-500"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-8 py-14 text-center text-gray-500"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(
                    (user) => (
                      <tr
                        key={
                          user.id
                        }
                        className="border-b border-gray-100 transition hover:bg-gray-50"
                      >
                        {/* USER */}
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 font-black text-violet-700">
                              {user.full_name
                                ?.charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <div>
                              <h3 className="font-bold text-gray-900">
                                {
                                  user.full_name
                                }
                              </h3>

                              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                                <User className="h-4 w-4" />

                                Customer
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* EMAIL */}
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Mail className="h-4 w-4 text-violet-600" />

                            {
                              user.email
                            }
                          </div>
                        </td>

                        {/* ROLE */}
                        <td className="px-8 py-6">
                          <select
                            value={
                              user.role
                            }
                            onChange={(
                              e
                            ) =>
                              handleRoleChange(
                                user.id,
                                e
                                  .target
                                  .value
                              )
                            }
                            className="rounded-2xl border border-gray-200 px-4 py-3 font-semibold outline-none transition focus:border-violet-500"
                          >
                            <option value="user">
                              User
                            </option>

                            <option value="admin">
                              Admin
                            </option>
                          </select>
                        </td>

                        {/* JOINED */}
                        <td className="px-8 py-6 text-gray-600">
                          {new Date(
                            user.created_at
                          ).toLocaleDateString()}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-8 py-6">
                          <button
                            onClick={() =>
                              handleDelete(
                                user.id
                              )
                            }
                            className="flex items-center gap-2 rounded-2xl bg-red-100 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-200"
                          >
                            <Trash2 className="h-4 w-4" />

                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;