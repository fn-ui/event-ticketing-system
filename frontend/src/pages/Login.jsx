import { useState } from "react";
import toast from "react-hot-toast";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import { loginUser } from "../services/authService";

import { supabase } from "../lib/supabase";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        const user =
          await loginUser(
            formData
          );

        const {
          data: profile,
          error,
        } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (
          profile?.role ===
          "admin"
        ) {
          navigate("/admin");
        } else {
          navigate(
            "/dashboard"
          );
        }
      } catch (error) {
        toast.error(
          error.message
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <MainLayout>
      <section className="flex min-h-[80vh] items-center justify-center py-20">
        <div className="w-full max-w-xl rounded-3xl bg-white p-10 shadow-xl">
          <div className="text-center">
            <h1 className="text-5xl font-black text-gray-900">
              Welcome Back
            </h1>

            <p className="mt-4 text-gray-500">
              Login to continue booking
              your favorite events.
            </p>
          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="mt-10 space-y-6"
          >
            <div>
              <label className="text-sm font-bold text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                required
                className="input-field mt-3"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                required
                className="input-field mt-3"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="primary-btn w-full"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500">
            Don’t have an
            account?{" "}
            <Link
              to="/register"
              className="font-bold text-violet-700"
            >
              Register
            </Link>
          </p>
        </div>
      </section>
    </MainLayout>
  );
}

export default Login;