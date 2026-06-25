import { useEffect, useState } from "react";

import AdminLayout from "../../components/dashboard/AdminLayout";
import toast from "react-hot-toast";
import {
  Bell,
  Lock,
  Save,
  Shield,
  User,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

import { supabase } from "../../lib/supabase";

function AdminSettings() {
  const { user } =
    useAuth();

  const [loading, setLoading] =
    useState(false);

  const [profileData, setProfileData] =
    useState({
      full_name: "",
      email: "",
    });

  const [passwordData, setPasswordData] =
    useState({
      password: "",
      confirmPassword: "",
    });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  async function fetchProfile() {
    try {
      const {
        data,
        error,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error)
        throw error;

      setProfileData({
        full_name:
          data.full_name || "",

        email:
          data.email || "",
      });
    } catch (error) {
      toast.error(
      "Failed to load profile"
       );
    }
  }

  async function updateProfile(
    e
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const { error } =
        await supabase
          .from(
            "profiles"
          )
          .update({
            full_name:
              profileData.full_name,
          })
          .eq(
            "id",
            user.id
          );

      if (error)
        throw error;

      toast.success(
        "Profile updated successfully"
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updatePassword(
  e
) {
  e.preventDefault();

  if (
    !passwordData.password ||
    !passwordData.confirmPassword
  ) {
    toast.error(
      "Please fill all password fields"
    );

    return;
  }

  if (
    passwordData.password.length <
    6
  ) {
    toast.error(
      "Password must be at least 6 characters"
    );

    return;
  }

  if (
    passwordData.password !==
    passwordData.confirmPassword
  ) {
    toast.error(
      "Passwords do not match"
    );

    return;
  }

  try {
    setLoading(true);

    const { error } =
      await supabase.auth.updateUser(
        {
          password:
            passwordData.password,
        }
      );

    if (error)
      throw error;

    toast.success(
      "Password updated successfully"
    );

    setPasswordData({
      password: "",
      confirmPassword: "",
    });
  } catch (error) {
    toast.error(
      error.message
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* HEADER */}
        <div>
          <h1 className="text-5xl font-black text-gray-900">
            Settings
          </h1>

          <p className="mt-3 text-lg text-gray-500">
            Manage your account,
            profile, security, and
            preferences.
          </p>
        </div>

        {/* PROFILE */}
        <div className="rounded-[32px] bg-white p-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
              <User className="h-8 w-8" />
            </div>

            <div>
              <h2 className="text-3xl font-black text-gray-900">
                Profile Settings
              </h2>

              <p className="mt-2 text-gray-500">
                Update your account
                information.
              </p>
            </div>
          </div>

          <form
            onSubmit={
              updateProfile
            }
            className="mt-10 grid gap-8 md:grid-cols-2"
          >
            {/* FULL NAME */}
            <div>
              <label className="text-sm font-bold text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                value={
                  profileData.full_name
                }
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    full_name:
                      e.target.value,
                  })
                }
                className="input-field mt-3"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-bold text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                value={
                  profileData.email
                }
                disabled
                className="input-field mt-3 cursor-not-allowed bg-gray-100"
              />
            </div>

            {/* BUTTON */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="primary-btn flex items-center gap-3"
              >
                <Save className="h-5 w-5" />

                {loading
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* PASSWORD */}
        <div className="rounded-[32px] bg-white p-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-700">
              <Lock className="h-8 w-8" />
            </div>

            <div>
              <h2 className="text-3xl font-black text-gray-900">
                Security
              </h2>

              <p className="mt-2 text-gray-500">
                Change your account
                password securely.
              </p>
            </div>
          </div>

          <form
            onSubmit={
              updatePassword
            }
            className="mt-10 grid gap-8 md:grid-cols-2"
          >
            {/* PASSWORD */}
            <div>
              <label className="text-sm font-bold text-gray-700">
                New Password
              </label>

              <input
                type="password"
                value={
                  passwordData.password
                }
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    password:
                      e.target.value,
                  })
                }
                className="input-field mt-3"
                placeholder="Enter new password"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-sm font-bold text-gray-700">
                Confirm Password
              </label>

              <input
                type="password"
                value={
                  passwordData.confirmPassword
                }
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword:
                      e.target.value,
                  })
                }
                className="input-field mt-3"
                placeholder="Confirm password"
              />
            </div>

            {/* BUTTON */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-3 rounded-2xl bg-red-600 px-8 py-4 font-semibold text-white transition hover:bg-red-700"
              >
                <Shield className="h-5 w-5" />

                {loading
                  ? "Updating..."
                  : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        {/* SYSTEM SETTINGS */}
        <div className="rounded-[32px] bg-white p-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-100 text-blue-700">
              <Bell className="h-8 w-8" />
            </div>

            <div>
              <h2 className="text-3xl font-black text-gray-900">
                Notifications
              </h2>

              <p className="mt-2 text-gray-500">
                Configure platform
                notification settings.
              </p>
            </div>
          </div>

          <div className="mt-10 space-y-6">
            {/* EMAIL */}
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Email Notifications
                </h3>

                <p className="mt-2 text-gray-500">
                  Receive updates about
                  bookings and payments.
                </p>
              </div>

              <input
                type="checkbox"
                defaultChecked
                className="h-6 w-6 accent-violet-700"
              />
            </div>

            {/* SECURITY */}
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Security Alerts
                </h3>

                <p className="mt-2 text-gray-500">
                  Get alerts for login
                  attempts and account
                  changes.
                </p>
              </div>

              <input
                type="checkbox"
                defaultChecked
                className="h-6 w-6 accent-violet-700"
              />
            </div>

            {/* BOOKINGS */}
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Booking Updates
                </h3>

                <p className="mt-2 text-gray-500">
                  Receive notifications
                  for ticket bookings.
                </p>
              </div>

              <input
                type="checkbox"
                defaultChecked
                className="h-6 w-6 accent-violet-700"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminSettings;