import { Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import ScrollToTop from "./components/layout/ScrollToTop";
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

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<AdminLayout />}>
          {/* Main Top-Level Admin Routes */}
          <Route index element={<AdminDashboard />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/workers" element={<AdminWorkers />} />
          <Route path="/shgs" element={<AdminSHGs />} />
          <Route path="/customers" element={<AdminCustomers />} />
          <Route path="/services" element={<AdminServices />} />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/suggestions" element={<AdminSuggestions />} />
          <Route path="/queries" element={<AdminQueries />} />
          <Route path="/sales" element={<AdminSales />} />
          <Route path="/contact" element={<AdminContact />} />
          <Route path="/others" element={<AdminOthers />} />

          {/* Compatible Aliases */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/workers" element={<AdminWorkers />} />
          <Route path="/admin/shgs" element={<AdminSHGs />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/suggestions" element={<AdminSuggestions />} />
          <Route path="/admin/queries" element={<AdminQueries />} />
          <Route path="/admin/sales" element={<AdminSales />} />
          <Route path="/admin/contact" element={<AdminContact />} />
          <Route path="/admin/others" element={<AdminOthers />} />
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
