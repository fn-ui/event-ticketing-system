import {
  ArrowLeft,
  Home,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center gradient-bg px-6">
      <div className="max-w-3xl text-center">
        {/* ERROR CODE */}
        <h1 className="text-[140px] font-black leading-none text-violet-700 md:text-[220px]">
          404
        </h1>

        {/* TITLE */}
        <h2 className="mt-6 text-5xl font-black text-gray-900">
          Page Not Found
        </h2>

        {/* DESCRIPTION */}
        <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-gray-500">
          The page you are looking for
          does not exist or may have
          been moved to another route.
        </p>

        {/* BUTTONS */}
        <div className="mt-12 flex flex-col justify-center gap-5 sm:flex-row">
          <Link
            to="/"
            className="primary-btn"
          >
            <Home className="mr-3 h-5 w-5" />
            Back To Home
          </Link>

          <button
            onClick={() =>
              window.history.back()
            }
            className="secondary-btn"
          >
            <ArrowLeft className="mr-3 h-5 w-5" />
            Go Back
          </button>
        </div>

        {/* CARD */}
        <div className="mt-16 rounded-3xl bg-white p-10 shadow-xl">
          <h3 className="text-2xl font-black text-gray-900">
            Event Ticketing System
          </h3>

          <p className="mt-4 text-gray-500">
            Continue exploring premium
            events, secure bookings,
            and modern payment
            integrations.
          </p>
        </div>
      </div>
    </section>
  );
}

export default NotFound;