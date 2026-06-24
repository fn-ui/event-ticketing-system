import {
  CircleOff,
} from "lucide-react";

function EmptyState({
  title = "No Data Found",
  description = "There is currently nothing to display.",
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-violet-200 bg-white p-10 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100">
        <CircleOff className="h-10 w-10 text-violet-700" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900">
        {title}
      </h2>

      <p className="mt-3 max-w-md text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default EmptyState;