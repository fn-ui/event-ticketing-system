import DashboardLayout from "../components/layout/DashboardLayout";

function Reports() {
  const reports = [
    {
      title: "Total Revenue",
      value: "KSh 350,000",
    },
    {
      title: "Tickets Sold",
      value: "1,250",
    },
    {
      title: "Successful Payments",
      value: "980",
    },
    {
      title: "Total Events",
      value: "24",
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">
          Reports & Analytics
        </h1>

        <p className="mt-3 text-lg text-gray-500">
          System performance overview.
        </p>
      </div>

      {/* Reports */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {reports.map((report) => (
          <div
            key={report.title}
            className="rounded-3xl bg-white p-8 shadow-sm"
          >
            <p className="text-gray-500">
              {report.title}
            </p>

            <h2 className="mt-4 text-4xl font-bold text-gray-900">
              {report.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Placeholder */}
      <div className="mt-10 rounded-3xl bg-white p-16 shadow-sm">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Advanced Analytics Coming Soon
          </h2>

          <p className="mt-4 max-w-2xl text-lg text-gray-500">
            This section will include downloadable
            reports, revenue trends, payment
            analytics, and event performance charts.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Reports;