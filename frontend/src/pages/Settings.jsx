import DashboardLayout from "../components/layout/DashboardLayout";

function Settings() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">
          System Settings
        </h1>

        <p className="mt-3 text-lg text-gray-500">
          Manage platform preferences.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Profile */}
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">
            Admin Profile
          </h2>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                defaultValue="Faith Njeri"
                className="h-14 w-full rounded-2xl border border-gray-300 px-4 outline-none focus:border-violet-700"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                defaultValue="admin@gmail.com"
                className="h-14 w-full rounded-2xl border border-gray-300 px-4 outline-none focus:border-violet-700"
              />
            </div>

            <button className="h-14 w-full rounded-2xl bg-violet-700 font-semibold text-white transition hover:bg-violet-800">
              Save Changes
            </button>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">
            Payment Providers
          </h2>

          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-5">
              <div>
                <h3 className="font-bold text-gray-900">
                  Paystack
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Enabled
                </p>
              </div>

              <div className="h-6 w-12 rounded-full bg-green-500"></div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-5">
              <div>
                <h3 className="font-bold text-gray-900">
                  PayPal
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Enabled
                </p>
              </div>

              <div className="h-6 w-12 rounded-full bg-green-500"></div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-5">
              <div>
                <h3 className="font-bold text-gray-900">
                  M-Pesa
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Enabled
                </p>
              </div>

              <div className="h-6 w-12 rounded-full bg-green-500"></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;