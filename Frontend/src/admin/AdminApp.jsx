import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import AdminLayout from "./components/layout/AdminLayout";
import ScrollToTop from "./components/layout/ScrollToTop";
import AdminLogin from "./pages/AdminLogin";
import { useAuth } from "./context/AuthContext";
import {
  AdminDashboard,
  AdminWorkers,
  AdminSHGs,
  AdminCustomers,
  AdminServices,
  AdminProducts,
  AdminSuggestions,
  AdminQueries,
  AdminSales,
  AdminContact,
  AdminOthers,
} from "./pages";

function AdminRoutes() {
  const { user } = useAuth();

  // Show login if not authenticated
  if (!user) {
    return <AdminLogin />;
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<AdminLayout />}>
          {/* Main Top-Level Admin Routes */}
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="workers" element={<AdminWorkers />} />
          <Route path="shgs" element={<AdminSHGs />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="suggestions" element={<AdminSuggestions />} />
          <Route path="queries" element={<AdminQueries />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="contact" element={<AdminContact />} />
          <Route path="others" element={<AdminOthers />} />
        </Route>

        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center gap-2 px-4 text-center">
              <h1 className="font-display text-3xl font-bold text-charcoal dark:text-dark-text">Page Not Found</h1>
              <p className="text-charcoal/55 dark:text-dark-muted text-sm">The requested admin panel module does not exist.</p>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default function AdminApp() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AdminRoutes />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
