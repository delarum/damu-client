import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import { LanguageProvider } from "./lib/LanguageContext";
import { HospitalAuthProvider } from "./lib/HospitalAuthContext";
import { AdminAuthProvider } from "./lib/AdminAuthContext";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "./components/ProtectedRoute";
import HospitalProtectedRoute from "./components/HospitalProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AccessibilityMenu from "./components/AccessibilityMenu";
import PageShell from "./components/PageShell";

import VideoIntro from "./components/VideoIntro";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ContactRequests from "./pages/ContactRequests";
import DonationHistory from "./pages/DonationHistory";
import Credits from "./pages/Credits";
import Badges from "./pages/Badges";
import Verification from "./pages/Verification";
import ThirdPartyApply from "./pages/ThirdPartyApply";

import HospitalLogin from "./pages/HospitalLogin";
import HospitalRegister from "./pages/HospitalRegister";
import HospitalDashboard from "./pages/HospitalDashboard";
import HospitalSearch from "./pages/HospitalSearch";
import HospitalRequests from "./pages/HospitalRequests";
import HospitalProfile from "./pages/HospitalProfile";
import HospitalStaff from "./pages/HospitalStaff";
import HospitalSubscription from "./pages/HospitalSubscription";
import HospitalAbout from "./pages/HospitalAbout";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHospitals from "./pages/AdminHospitals";
import AdminAuditLogs from "./pages/AdminAuditLogs";

import NotFound from "./pages/NotFound";
import About from "./pages/About";

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <PageShell>
                  <Landing />
                  <AnimatePresence mode="wait">
                    {!introDone && (
                      <VideoIntro
                        onComplete={() => setIntroDone(true)}
                      />
                    )}
                  </AnimatePresence>
                </PageShell>
              }
            />
            <Route path="/signup" element={<PageShell><SignUp /></PageShell>} />
            <Route path="/login" element={<PageShell><Login /></PageShell>} />

            <Route path="/profile-setup" element={<PageShell><ProtectedRoute><ProfileSetup /></ProtectedRoute></PageShell>} />
            <Route path="/profile" element={<PageShell><ProtectedRoute><Profile /></ProtectedRoute></PageShell>} />
            <Route path="/dashboard" element={<PageShell><ProtectedRoute><Dashboard /></ProtectedRoute></PageShell>} />
            <Route path="/requests" element={<PageShell><ProtectedRoute><ContactRequests /></ProtectedRoute></PageShell>} />
            <Route path="/donations" element={<PageShell><ProtectedRoute><DonationHistory /></ProtectedRoute></PageShell>} />
            <Route path="/credits" element={<PageShell><ProtectedRoute><Credits /></ProtectedRoute></PageShell>} />
            <Route path="/badges" element={<PageShell><ProtectedRoute><Badges /></ProtectedRoute></PageShell>} />
            <Route path="/verification" element={<PageShell><ProtectedRoute><Verification /></ProtectedRoute></PageShell>} />
            <Route path="/third-party/apply" element={<PageShell><ProtectedRoute><ThirdPartyApply /></ProtectedRoute></PageShell>} />
            <Route path="/about" element={<PageShell><ProtectedRoute><About/></ProtectedRoute></PageShell>} />

            <Route path="/hospital/login" element={<PageShell><HospitalAuthProvider><HospitalLogin /></HospitalAuthProvider></PageShell>} />
            <Route path="/hospital/register" element={<PageShell><HospitalAuthProvider><HospitalRegister /></HospitalAuthProvider></PageShell>} />
            <Route path="/hospital/dashboard" element={<PageShell><HospitalAuthProvider><HospitalProtectedRoute><HospitalDashboard /></HospitalProtectedRoute></HospitalAuthProvider></PageShell>} />
            <Route path="/hospital/search" element={<PageShell><HospitalAuthProvider><HospitalProtectedRoute><HospitalSearch /></HospitalProtectedRoute></HospitalAuthProvider></PageShell>} />
            <Route path="/hospital/requests" element={<PageShell><HospitalAuthProvider><HospitalProtectedRoute><HospitalRequests /></HospitalProtectedRoute></HospitalAuthProvider></PageShell>} />
            <Route path="/hospital/profile" element={<PageShell><HospitalAuthProvider><HospitalProtectedRoute><HospitalProfile /></HospitalProtectedRoute></HospitalAuthProvider></PageShell>} />
            <Route path="/hospital/staff" element={<PageShell><HospitalAuthProvider><HospitalProtectedRoute><HospitalStaff /></HospitalProtectedRoute></HospitalAuthProvider></PageShell>} />
            <Route path="/hospital/subscription" element={<PageShell><HospitalAuthProvider><HospitalProtectedRoute><HospitalSubscription /></HospitalProtectedRoute></HospitalAuthProvider></PageShell>} />
            <Route path="/hospital/about" element={<PageShell><HospitalAuthProvider><HospitalProtectedRoute><HospitalAbout /></HospitalProtectedRoute></HospitalAuthProvider></PageShell>} />

            <Route path="/admin/login" element={<PageShell><AdminAuthProvider><AdminLogin /></AdminAuthProvider></PageShell>} />
            <Route path="/admin/dashboard" element={<PageShell><AdminAuthProvider><AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute></AdminAuthProvider></PageShell>} />
            <Route path="/admin/hospitals" element={<PageShell><AdminAuthProvider><AdminProtectedRoute><AdminHospitals /></AdminProtectedRoute></AdminAuthProvider></PageShell>} />
            <Route path="/admin/audit-logs" element={<PageShell><AdminAuthProvider><AdminProtectedRoute><AdminAuditLogs /></AdminProtectedRoute></AdminAuthProvider></PageShell>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <AccessibilityMenu />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
