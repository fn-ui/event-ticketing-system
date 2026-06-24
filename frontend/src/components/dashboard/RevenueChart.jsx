const monthlyRevenue = [
  {
    month: "Jan",
    revenue: 40000,
  },
  {
    month: "Feb",
    revenue: 55000,
  },
  {
    month: "Mar",
    revenue: 70000,
  },
  {
    month: "Apr",
    revenue: 85000,
  },
  {
    month: "May",
    revenue: 120000,
  },
  {
    month: "Jun",
    revenue: 95000,
  },
];

function RevenueChart() {
  const maxRevenue = Math.max(
    ...monthlyRevenue.map(
      (item) => item.revenue
    )
  );

  return (
    <div className="dashboard-card">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900">
          Revenue Overview
        </h2>

        <p className="mt-2 text-gray-500">
          Monthly ticket sales and
          earnings.
        </p>
      </div>

      {/* Chart */}
      <div className="flex h-[320px] items-end justify-between gap-4">
        {monthlyRevenue.map((item) => {
          const height =
            (item.revenue / maxRevenue) *
            100;

          return (
            <div
              key={item.month}
              className="flex flex-1 flex-col items-center"
            >
              <div className="mb-4 text-sm font-semibold text-gray-500">
                KSh{" "}
                {item.revenue.toLocaleString()}
              </div>

              <div className="flex h-[220px] items-end">
                <div
                  style={{
                    height: `${height}%`,
                  }}
                  className="w-14 rounded-t-3xl bg-gradient-to-t from-violet-700 to-violet-400 transition-all duration-500"
                ></div>
              </div>

              <div className="mt-4 font-semibold text-gray-700">
                {item.month}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RevenueChart;