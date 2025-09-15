import { AdminNavbar } from "./_components/admin-navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminNavbar />
      {children}
    </div>
  );
}
