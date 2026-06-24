import { useState } from "react";

import { Link } from "react-router-dom";

function LoginForm() {
  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
  };

  return (
    <div className="rounded-[32px] bg-white p-10 shadow-sm">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Welcome Back
        </h1>

        <p className="mt-4 text-gray-500">
          Login to your account
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div>
          <label className="mb-3 block font-semibold text-gray-700">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="mb-3 block font-semibold text-gray-700">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={
              formData.password
            }
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <button
          type="submit"
          className="primary-btn w-full"
        >
          Login
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-gray-500">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-violet-700"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;