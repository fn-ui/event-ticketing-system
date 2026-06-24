function Loader({
  text = "Loading...",
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-5">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-violet-200 border-t-violet-700"></div>

      <p className="text-lg font-medium text-gray-600">
        {text}
      </p>
    </div>
  );
}

export default Loader;