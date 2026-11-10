import { isAdminAuthenticated } from "@/lib/admin-auth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Private Admin | The Damac Global", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  return authenticated ? <AdminDashboard /> : <AdminLogin />;
}
