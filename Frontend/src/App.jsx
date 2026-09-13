import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { retriggerGoogleTranslate } from "./utils/googleTranslate";
import {
  LayoutDashboard, ClipboardList, CalendarCheck, Wallet, Star, User,
  Inbox, Briefcase, Settings2, Clock, IndianRupee,
  ShoppingBag, Users, TrendingUp, MessageSquare, Sliders,
  Users2, ShieldCheck, FileWarning, BarChart3, Globe2, Cog, Activity, HelpCircle, MapPin,
  UserCheck, Package, Lightbulb, PhoneCall, Sparkles
} from "lucide-react";

import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardSubpage from "./components/dashboards/DashboardSubpage";
import RequireAuth from "./components/auth/RequireAuth";
import ScrollToTop from "./components/layout/ScrollToTop";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Workers from "./pages/Workers";
import WorkerProfile from "./pages/WorkerProfile";
import SHGs from "./pages/SHGs";
import SHGProfile from "./pages/SHGProfile";
import HowItWorks from "./pages/HowItWorks";
import Work from "./pages/Work";
import WorkDetail from "./pages/WorkDetail";
import Resources from "./pages/Resources";
import ResourceDetail from "./pages/ResourceDetail";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import CustomerMap from "./pages/dashboards/CustomerMap";
import CustomerReviews from "./pages/dashboards/CustomerReviews";
import CustomerProfile from "./pages/dashboards/CustomerProfile";
import CustomerActivity from "./pages/dashboards/CustomerActivity";
import CustomerQueries from "./pages/dashboards/CustomerQueries";
import CustomerPayments from "./pages/dashboards/CustomerPayments";
import WorkerDashboard from "./pages/dashboards/WorkerDashboard";
import WorkerRequests from "./pages/dashboards/WorkerRequests";
import WorkerReviews from "./pages/dashboards/WorkerReviews";
import WorkerProfileDashboard from "./pages/dashboards/WorkerProfileDashboard";
import WorkerAvailability from "./pages/dashboards/WorkerAvailability";
import WorkerEarnings from "./pages/dashboards/WorkerEarnings";
import WorkerServices from "./pages/dashboards/WorkerServices";
import SHGDashboard from "./pages/dashboards/SHGDashboard";
import SHGOrders from "./pages/dashboards/SHGOrders";
import SHGMembers from "./pages/dashboards/SHGMembers";
import SHGProducts from "./pages/dashboards/SHGProducts";
import SHGEarnings from "./pages/dashboards/SHGEarnings";
import SHGReviews from "./pages/dashboards/SHGReviews";


import AdminApp from "./admin/AdminApp";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import OrderAutomationHub from "./components/automation/OrderAutomationHub";

const customerNav = [
  { to: "/customer", end: true, label: "Overview", icon: LayoutDashboard },
  { to: "/customer/automation", label: "Order Automation", icon: Sparkles },
  { to: "/customer/map", label: "Nearby Map", icon: MapPin },
  { to: "/customer/activity", label: "Recent Activity", icon: Activity },
  { to: "/customer/payments", label: "Payments", icon: Wallet },
  { to: "/customer/reviews", label: "Reviews", icon: Star },
  { to: "/customer/queries", label: "Queries", icon: HelpCircle },
  { to: "/customer/profile", label: "Profile", icon: User },
];

const workerNav = [
  { to: "/worker", end: true, label: "Overview", icon: LayoutDashboard },
  { to: "/worker/requests", label: "Requests", icon: Inbox },
  { to: "/worker/services", label: "Services", icon: Settings2 },
  { to: "/worker/availability", label: "Availability", icon: Clock },
  { to: "/worker/earnings", label: "Earnings", icon: IndianRupee },
  { to: "/worker/reviews", label: "Reviews", icon: Star },
];

const shgNav = [
  { to: "/shg", end: true, label: "Overview", icon: LayoutDashboard },
  { to: "/shg/orders", label: "Orders", icon: ShoppingBag },
  { to: "/shg/products", label: "Your Products", icon: Package },
  { to: "/shg/members", label: "Members", icon: Users },
  { to: "/shg/earnings", label: "Earnings", icon: IndianRupee },
  { to: "/shg/reviews", label: "Reviews", icon: MessageSquare },
];

export default function App() {
  const location = useLocation();

  useEffect(() => {
    retriggerGoogleTranslate();
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
        {/* Public before login */}
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />

        {/* Feature routes locked inside - require login */}
        <Route path="/services" element={<RequireAuth><Services /></RequireAuth>} />
        <Route path="/services/:serviceId" element={<RequireAuth><ServiceDetail /></RequireAuth>} />
        <Route path="/workers" element={<RequireAuth><Workers /></RequireAuth>} />
        <Route path="/workers/:workerId" element={<RequireAuth><WorkerProfile /></RequireAuth>} />
        <Route path="/shgs" element={<RequireAuth><SHGs /></RequireAuth>} />
        <Route path="/shgs/:shgId" element={<RequireAuth><SHGProfile /></RequireAuth>} />
        <Route path="/about" element={<RequireAuth><About /></RequireAuth>} />
        <Route path="/work" element={<RequireAuth><Work /></RequireAuth>} />
        <Route path="/work/:projectId" element={<RequireAuth><WorkDetail /></RequireAuth>} />
        <Route path="/resources" element={<RequireAuth><Resources /></RequireAuth>} />
        <Route path="/resources/:resourceId" element={<RequireAuth><ResourceDetail /></RequireAuth>} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Dashboard Subroutes (Protected by RequireAuth) */}
      <Route
        path="/customer"
        element={
          <RequireAuth roleRequired="customer">
            <DashboardLayout navItems={customerNav} roleLabel="Customer" />
          </RequireAuth>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="automation" element={<OrderAutomationHub />} />
        <Route path="map" element={<CustomerMap />} />
        <Route path="activity" element={<CustomerActivity />} />
        <Route path="requests" element={<CustomerActivity />} />
        <Route path="payments" element={<CustomerPayments />} />
        <Route path="reviews" element={<CustomerReviews />} />
        <Route path="queries" element={<CustomerQueries />} />
        <Route path="profile" element={<CustomerProfile />} />
      </Route>

      {/* Worker Dashboard Subroutes (Protected by RequireAuth) */}
      <Route
        path="/worker"
        element={
          <RequireAuth roleRequired="worker">
            <DashboardLayout navItems={workerNav} roleLabel="Worker" />
          </RequireAuth>
        }
      >
        <Route index element={<WorkerDashboard />} />
        <Route
          path="requests"
          element={<WorkerRequests />}
        />
        <Route
          path="services"
          element={<WorkerServices />}
        />
        <Route
          path="availability"
          element={<WorkerAvailability />}
        />
        <Route
          path="earnings"
          element={<WorkerEarnings />}
        />
        <Route
          path="reviews"
          element={<WorkerReviews />}
        />
        <Route
          path="profile"
          element={<WorkerProfileDashboard />}
        />
      </Route>

      {/* SHG Dashboard Subroutes (Protected by RequireAuth) */}
      <Route
        path="/shg"
        element={
          <RequireAuth roleRequired="shg">
            <DashboardLayout navItems={shgNav} roleLabel="SHG" />
          </RequireAuth>
        }
      >
        <Route index element={<SHGDashboard />} />
        <Route path="orders" element={<SHGOrders />} />
        <Route path="services" element={<Navigate to="/shg/products" replace />} />
        <Route path="products" element={<SHGProducts />} />
        <Route path="members" element={<SHGMembers />} />
        <Route path="earnings" element={<SHGEarnings />} />
        <Route path="customers" element={<Navigate to="/shg/products" replace />} />
        <Route path="reviews" element={<SHGReviews />} />
        <Route path="settings" element={<Navigate to="/shg" replace />} />
        <Route path="profile" element={<Navigate to="/" replace />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminApp />} />

      <Route
        path="*"
        element={
          <div className="min-h-screen flex flex-col items-center justify-center gap-2 px-4 text-center">
            <h1 className="font-display text-3xl">Page not found</h1>
            <p className="text-charcoal/55">The page you're looking for doesn't exist.</p>
          </div>
        }
      />
    </Routes>
    </>
  );
}
