import {
  CalendarDays,
  CreditCard,
  Mail,
  ShieldCheck,
  Ticket,
  User,
} from "lucide-react";

import MainLayout from "../components/layout/MainLayout";

import { useAuth } from "../contexts/AuthContext";

function Profile() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <section className="section-padding">
        <div className="container-width px-6">
          {/* HEADER */}
          <div>
            <h1 className="text-5xl font-black text-gray-900">
              My Profile
            </h1>

            <p className="mt-4 text-lg text-gray-500">
              Manage your account
              information and activity.
            </p>
          </div>

          {/* PROFILE CARD */}
          <div className="mt-14 overflow-hidden rounded-3xl bg-white shadow-xl">
            {/* TOP */}
            <div className="relative h-56 bg-gradient-to-r from-violet-700 via-purple-700 to-pink-600">
              <div className="absolute -bottom-16 left-10 flex h-32 w-32 items-center justify-center rounded-3xl border-8 border-white bg-white shadow-xl">
                <User className="h-16 w-16 text-violet-700" />
              </div>
            </div>

            {/* CONTENT */}
            <div className="px-10 pb-10 pt-24">
              <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
                {/* USER INFO */}
                <div>
                  <h2 className="text-4xl font-black text-gray-900">
                    {
                      user
                        ?.user_metadata
                        ?.full_name
                    }
                  </h2>

                  <div className="mt-6 flex flex-col gap-5">
                    {/* EMAIL */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100">
                        <Mail className="h-6 w-6 text-violet-700" />
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Email Address
                        </p>

                        <h4 className="font-bold text-gray-900">
                          {user?.email}
                        </h4>
                      </div>
                    </div>

                    {/* USER ID */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                        <ShieldCheck className="h-6 w-6 text-blue-700" />
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Account ID
                        </p>

                        <h4 className="max-w-md break-all font-bold text-gray-900">
                          {user?.id}
                        </h4>
                      </div>
                    </div>

                    {/* CREATED */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                        <CalendarDays className="h-6 w-6 text-green-700" />
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Joined
                        </p>

                        <h4 className="font-bold text-gray-900">
                          {new Date(
                            user?.created_at
                          ).toLocaleDateString()}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QUICK STATS */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* BOOKINGS */}
                  <div className="rounded-3xl bg-violet-50 p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-700">
                      <Ticket className="h-7 w-7 text-white" />
                    </div>

                    <p className="mt-6 text-gray-500">
                      Ticket Access
                    </p>

                    <h3 className="mt-2 text-3xl font-black text-violet-900">
                      Active
                    </h3>
                  </div>

                  {/* PAYMENTS */}
                  <div className="rounded-3xl bg-green-50 p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-700">
                      <CreditCard className="h-7 w-7 text-white" />
                    </div>

                    <p className="mt-6 text-gray-500">
                      Payment Status
                    </p>

                    <h3 className="mt-2 text-3xl font-black text-green-900">
                      Verified
                    </h3>
                  </div>
                </div>
              </div>

              {/* ACCOUNT STATUS */}
              <div className="mt-14 rounded-3xl border border-violet-100 bg-violet-50 p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-violet-900">
                      Premium Event Access
                    </h3>

                    <p className="mt-2 text-violet-700">
                      Your account is fully
                      active and ready for
                      event bookings.
                    </p>
                  </div>

                  <span className="badge-success">
                    Account Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Profile;