import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { retriggerGoogleTranslate } from "./utils/googleTranslate";
import {
  LayoutDashboard, ClipboardList, CalendarCheck, Wallet, Star, User,
  Inbox, Briefcase, Settings2, Clock, IndianRupee,
  ShoppingBag, Users, TrendingUp, MessageSquare, Sliders,
  Users2, ShieldCheck, FileWarning, BarChart3, Globe2, Cog,
} from "lucide-react";

import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardSubpage from "./components/dashboards/DashboardSubpage";
import RequireAuth from "./components/auth/RequireAuth";

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
import WorkerDashboard from "./pages/dashboards/WorkerDashboard";
import SHGDashboard from "./pages/dashboards/SHGDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";

const customerNav = [
  { to: "/customer", end: true, label: "Overview", icon: LayoutDashboard },
  { to: "/shgs", label: "SHG Store", icon: ShoppingBag },
  { to: "/customer/requests", label: "My Requests", icon: ClipboardList },
  { to: "/customer/jobs", label: "Active Jobs", icon: CalendarCheck },
  { to: "/customer/payments", label: "Payments", icon: Wallet },
  { to: "/customer/reviews", label: "Reviews", icon: Star },
  { to: "/customer/profile", label: "Profile", icon: User },
];

const workerNav = [
  { to: "/worker", end: true, label: "Overview", icon: LayoutDashboard },
  { to: "/worker/requests", label: "Requests", icon: Inbox },
  { to: "/worker/jobs", label: "My Jobs", icon: Briefcase },
  { to: "/worker/services", label: "Services", icon: Settings2 },
  { to: "/worker/availability", label: "Availability", icon: Clock },
  { to: "/worker/earnings", label: "Earnings", icon: IndianRupee },
  { to: "/worker/reviews", label: "Reviews", icon: Star },
  { to: "/worker/profile", label: "Profile", icon: User },
];

const shgNav = [
  { to: "/shg", end: true, label: "Overview", icon: LayoutDashboard },
  { to: "/shg/orders", label: "Orders", icon: ShoppingBag },
  { to: "/shg/services", label: "Services", icon: Settings2 },
  { to: "/shg/members", label: "Members", icon: Users },
  { to: "/shg/earnings", label: "Earnings", icon: IndianRupee },
  { to: "/shg/customers", label: "Customers", icon: TrendingUp },
  { to: "/shg/reviews", label: "Reviews", icon: MessageSquare },
  { to: "/shg/settings", label: "Settings", icon: Sliders },
];

const adminNav = [
  { to: "/admin", end: true, label: "Overview", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users2 },
  { to: "/admin/verification", label: "Verification", icon: ShieldCheck },
  { to: "/admin/complaints", label: "Complaints", icon: FileWarning },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/languages", label: "Languages", icon: Globe2 },
  { to: "/admin/settings", label: "System Settings", icon: Cog },
];

export default function App() {
  const location = useLocation();

  useEffect(() => {
    retriggerGoogleTranslate();
  }, [location.pathname]);

  return (
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
        <Route path="/contact" element={<RequireAuth><Contact /></RequireAuth>} />
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
        <Route
          path="requests"
          element={<DashboardSubpage title="Service Requests" subtitle="Track all your sent requests and live responses" category="Service Request" actionLabel="New Request" />}
        />
        <Route
          path="jobs"
          element={<DashboardSubpage title="Active Bookings & Jobs" subtitle="Workers currently on-site or scheduled for this week" category="Job" actionLabel="Schedule Job" />}
        />
        <Route
          path="payments"
          element={<DashboardSubpage title="Payment History" subtitle="Verified digital and cash transaction slips" category="Payment Slip" actionLabel="Make Payment" />}
        />
        <Route
          path="reviews"
          element={<DashboardSubpage title="My Reviews" subtitle="Feedback left for local providers and SHG crafts" category="Review" actionLabel="Write Review" />}
        />
        <Route
          path="profile"
          element={<DashboardSubpage title="Customer Profile" subtitle="Account details, saved village locations, and language preference" category="Profile Update" actionLabel="Edit Profile" />}
        />
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
          element={<DashboardSubpage title="Incoming Requests" subtitle="New customer requests in your 10km village radius" category="Incoming Lead" actionLabel="Refresh Radius" />}
        />
        <Route
          path="jobs"
          element={<DashboardSubpage title="Assigned Jobs" subtitle="Jobs you have accepted and scheduled dates" category="Job Assignment" actionLabel="Add Walk-in Job" />}
        />
        <Route
          path="services"
          element={<DashboardSubpage title="My Services & Rates" subtitle="Manage your trade listings, day-rates and emergency visit fee" category="Trade Listing" actionLabel="Add Skill" />}
        />
        <Route
          path="availability"
          element={<DashboardSubpage title="Working Hours & Availability" subtitle="Set days and timing when customers can book you" category="Schedule Slot" actionLabel="Add Slot" />}
        />
        <Route
          path="earnings"
          element={<DashboardSubpage title="Direct Income Breakdown" subtitle="Transparent record of weekly payouts and cash settlements" category="Earnings Entry" actionLabel="Withdraw Funds" />}
        />
        <Route
          path="reviews"
          element={<DashboardSubpage title="Customer Ratings" subtitle="Verified reviews that boost your smart match score" category="Customer Feedback" actionLabel="Share Profile" />}
        />
        <Route
          path="profile"
          element={<DashboardSubpage title="Worker Profile & Documents" subtitle="Aadhaar KYC, skill certificates, and SHG endorsements" category="Document Upload" actionLabel="Update KYC" />}
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
        <Route
          path="orders"
          element={<DashboardSubpage title="Group Bulk Orders" subtitle="Orders placed for catering, handloom batches, and organic harvest" category="Group Order" actionLabel="New Bulk Order" />}
        />
        <Route
          path="services"
          element={<DashboardSubpage title="Products & Services Catalog" subtitle="Active catalog items listed across regional Karya hubs" category="Catalog Item" actionLabel="Add Product" />}
        />
        <Route
          path="members"
          element={<DashboardSubpage title="SHG Member Roster" subtitle="Manage 24 active women artisans and verified bank links" category="Member Record" actionLabel="Add Member" />}
        />
        <Route
          path="earnings"
          element={<DashboardSubpage title="Shared Group Income" subtitle="Ledger of cluster revenue and member dividends" category="Dividend Settlement" actionLabel="Distribute Payout" />}
        />
        <Route
          path="customers"
          element={<DashboardSubpage title="Customer Directory" subtitle="Repeat buyers and institutional school/office clients" category="Client Profile" actionLabel="Add Client" />}
        />
        <Route
          path="reviews"
          element={<DashboardSubpage title="Community Testimonials" subtitle="Quality ratings on bulk food, stitching, and organic goods" category="SHG Review" actionLabel="Export Ratings" />}
        />
        <Route
          path="settings"
          element={<DashboardSubpage title="SHG Governance Settings" subtitle="Cluster registration number, bank accounts, and verification badges" category="Cluster Record" actionLabel="Update Reg" />}
        />
      </Route>

      {/* Super Admin Dashboard Subroutes (Protected by RequireAuth) */}
      <Route
        path="/admin"
        element={
          <RequireAuth roleRequired="admin">
            <DashboardLayout navItems={adminNav} roleLabel="Admin" />
          </RequireAuth>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route
          path="users"
          element={<DashboardSubpage title="Platform User Directory" subtitle="All registered customers, workers, and SHG federations" category="User Account" actionLabel="Create User" />}
        />
        <Route
          path="verification"
          element={<DashboardSubpage title="KYC & Skill Verification Desk" subtitle="Pending Aadhaar and certificate approvals" category="Verification Ticket" actionLabel="Run Bulk Audit" />}
        />
        <Route
          path="complaints"
          element={<DashboardSubpage title="Resolution Desk" subtitle="Customer or worker dispute tickets with mediation log" category="Dispute Ticket" actionLabel="Open Dispute" />}
        />
        <Route
          path="analytics"
          element={<DashboardSubpage title="Platform Analytics" subtitle="District growth, job completion velocity, and offline sync metrics" category="Metric Report" actionLabel="Export CSV" />}
        />
        <Route
          path="languages"
          element={<DashboardSubpage title="Translation Management" subtitle="Manage 7 Indian languages and locale coverage" category="Locale Package" actionLabel="Add Locale Key" />}
        />
        <Route
          path="settings"
          element={<DashboardSubpage title="System Configuration" subtitle="API gateways, matching weights, and SMS failover params" category="System Param" actionLabel="Backup Config" />}
        />
      </Route>

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
  );
}
