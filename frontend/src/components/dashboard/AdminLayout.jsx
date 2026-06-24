import AdminSidebar from "./AdminSidebar";

function AdminLayout({
  children,
}) {
  return (
    <div className="bg-slate-50">
      <AdminSidebar />

      <main className="ml-72 min-h-screen p-10">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;