function StatsCard({
  title,
  value,
  icon,
  growth,
}) {
  return (
    <div className="dashboard-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-gray-900">
            {value}
          </h2>
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
          {icon}
        </div>
      </div>

      <div className="mt-8">
        <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
          +{growth}%
        </span>

        <span className="ml-3 text-sm text-gray-500">
          from last month
        </span>
      </div>
    </div>
  );
}

export default StatsCard;