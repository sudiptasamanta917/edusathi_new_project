import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { ThemeProvider } from "@/src/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/EdusathiDashboard/Dashboard";
import CreateCenter from "./pages/EdusathiDashboard/CreateCenter";
import CenterList from "./pages/EdusathiDashboard/CenterList";
import Pricing from "./pages/business/Pricing";
import PricingForm from "./pages/business/PricingForm";
import AboutUs from "./pages/Edusathihome/AboutUs";
import ContactUs from "./pages/Edusathihome/ContactUs";
import Login from "./pages/EdusathiDashboard/Login";
// import Admin from "./pages/admin"; 
import { ProtectedRoute } from "./components/ProtectedRoute";
import Admin from "./pages/business/admin";
import Settings from "./pages/EdusathiDashboard/Settings";
import GetStarted from "./pages/Edusathihome/GetStarted";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/student/StudentDashboard";
import CreatorDashboard from "./pages/creator/CreatorDashboard";
import BusinessDashboard from "./pages/business/BusinessDashboard";
import CreatorUpload from "./pages/creator/CreatorUpload";
import CreatorContents from "./pages/creator/CreatorContents";
import CreatorSales from "./pages/creator/CreatorSales";
import CreatorContentDetail from "./pages/creator/CreatorContentDetail";
import Catalog from "./pages/student/Catalog";
import MyCourses from "./pages/student/MyCourses";
import Profile from "./pages/Profile";
import PriceManagement from "./pages/business/PriceManagement";
import DashboardLogin from "./pages/EdusathiDashboard/DashboardLogin";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
     
      <Route path="/" element={<Index />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/pricing/setup" element={<PricingForm />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/student"
        element={
          <ProtectedRoute roles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/*"
        element={
          <ProtectedRoute roles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/creator"
        element={
          <ProtectedRoute roles={["creator"]}>
            <CreatorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/creator/*"
        element={
          <ProtectedRoute roles={["creator"]}>
            <CreatorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business"
        element={
          <ProtectedRoute roles={["business"]}>
            <BusinessDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/*"
        element={
          <ProtectedRoute roles={["business"]}>
            <BusinessDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings/pricing"
        element={
          <PriceManagement />
        }
      />
      <Route path="/catalog" element={<Catalog />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-courses"
        element={
          <ProtectedRoute roles={["student"]}>
            <MyCourses />
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard" element={<DashboardLogin />} />
      <Route
        path="/dashboard/overview"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/creator/upload"
        element={
          <ProtectedRoute roles={["creator"]}>
            <CreatorUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/creator/contents"
        element={
          <ProtectedRoute roles={["creator"]}>
            <CreatorContents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/creator/content/:id"
        element={
          <ProtectedRoute roles={["creator"]}>
            <CreatorContentDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/creator/sales"
        element={
          <ProtectedRoute roles={["creator"]}>
            <CreatorSales />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/centers"
        element={
          <ProtectedRoute>
            <CenterList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/centers/create"
        element={
          <ProtectedRoute>
            <CreateCenter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </>
  )
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider
          router={router}
          future={{ v7_startTransition: true }}
        />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
