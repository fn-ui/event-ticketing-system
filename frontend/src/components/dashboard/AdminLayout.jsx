import AdminSidebar from "./AdminSidebar";

function AdminLayout({
  children,
}) {
  return (
    <div className="flex bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;