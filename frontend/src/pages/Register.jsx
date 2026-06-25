import { useState } from "react";
import toast from "react-hot-toast";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import {
  registerUser,
} from "../services/authService";

function Register() {
  const navigate =
    useNavigate();

  const [formData, setFormData] =
    useState({
      fullName: "",
      email: "",
      password: "",
      confirmPassword:
        "",
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

      if (
        !formData.fullName ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        toast.error(
          "Please fill all fields"
        );

        return;
      }

      if (
        formData.password !==
        formData.confirmPassword
      ) {
        toast.error(
          "Passwords do not match"
        );

        return;
      }

      if (
        formData.password.length <
        6
      ) {
        toast.error(
          "Password must be at least 6 characters"
        );

        return;
      }

      try {
        setLoading(true);

        await registerUser({
          fullName:
            formData.fullName,
          email:
            formData.email,
          password:
            formData.password,
        });

        toast.success(
          "Account created successfully"
        );

        navigate("/login");
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
      <section className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-6 py-20">
        <div className="w-full max-w-2xl rounded-[32px] bg-white p-10 shadow-xl md:p-14">
          {/* HEADER */}
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100">
              <span className="text-3xl font-black text-violet-700">
                E
              </span>
            </div>

            <h1 className="mt-8 text-5xl font-black text-gray-900">
              Create Account
            </h1>

            <p className="mt-5 text-lg leading-8 text-gray-500">
              Join EventHub and
              start booking amazing
              events with secure
              payments.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={
              handleSubmit
            }
            className="mt-12 space-y-7"
          >
            {/* FULL NAME */}
            <div>
              <label className="text-sm font-bold text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={
                  formData.fullName
                }
                onChange={
                  handleChange
                }
                required
                placeholder="Enter your full name"
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
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                required
                placeholder="Enter your email address"
                className="input-field mt-3"
              />
            </div>

            {/* PASSWORD */}
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
                placeholder="Create a password"
                className="input-field mt-3"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-sm font-bold text-gray-700">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={
                  formData.confirmPassword
                }
                onChange={
                  handleChange
                }
                required
                placeholder="Confirm your password"
                className="input-field mt-3"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="primary-btn w-full"
            >
              {loading
                ? "Creating Account..."
                : "Register"}
            </button>
          </form>

          {/* LOGIN */}
          <div className="mt-10 text-center">
            <p className="text-gray-500">
              Already have an
              account?{" "}
              <Link
                to="/login"
                className="font-bold text-violet-700 transition hover:text-violet-900"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Register;