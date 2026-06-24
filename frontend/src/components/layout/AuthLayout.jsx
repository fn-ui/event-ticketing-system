function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F3FF] px-4 py-10">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;