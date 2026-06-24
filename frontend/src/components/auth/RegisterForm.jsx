import { useState } from "react";

import { Link } from "react-router-dom";

function RegisterForm() {
  const [formData, setFormData] =
    useState({
      fullName: "",
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
          Create Account
        </h1>

        <p className="mt-4 text-gray-500">
          Register to continue
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div>
          <label className="mb-3 block font-semibold text-gray-700">
            Full Name
          </label>

          <input
            type="text"
            name="fullName"
            placeholder="Enter full name"
            value={
              formData.fullName
            }
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="mb-3 block font-semibold text-gray-700">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
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
            placeholder="Create password"
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
          Create Account
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-violet-700"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;