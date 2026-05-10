import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import "./App.css";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import PortalPage from "./pages/PortalPage";
import AboutPage from "./pages/AboutPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useAuth } from "./hooks/useAuth";
import { useAdminAuth } from "./hooks/useAdminAuth";

const VIEWS = ["inicio", "about", "login", "registro", "portal", "admin"];

const getInitialView = () => {
  const hash = window.location.hash.replace("#", "");
  if (!hash) return "inicio";
  if (VIEWS.includes(hash)) return hash;
  return "404";
};

export default function App() {
  const [view, setView] = useState(getInitialView);
  const auth = useAuth();
  const adminAuth = useAdminAuth();

  useEffect(() => {
    const syncView = () => setView(getInitialView());
    window.addEventListener("hashchange", syncView);
    return () => window.removeEventListener("hashchange", syncView);
  }, []);

  const navigate = (nextView) => {
    window.location.hash = nextView;
    setView(nextView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    auth.logout();
    navigate("inicio");
  };

  const handleAdminLogout = () => {
    adminAuth.logout();
    navigate("inicio");
  };

  if (view === "portal" && !auth.currentGuest) {
    navigate("login");
    return null;
  }

  let page;
  if (view === "login" || view === "registro") {
    page = <AuthPage mode={view} auth={auth} onNavigate={navigate} />;
  } else if (view === "portal" && auth.currentGuest) {
    page = (
      <PortalPage
        guest={auth.currentGuest}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    );
  } else if (view === "about") {
    page = (
      <AboutPage
        currentGuest={auth.currentGuest}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    );
  } else if (view === "admin") {
    page = (
      <AdminPage
        admin={adminAuth.currentAdmin}
        onLogin={adminAuth.login}
        onLogout={handleAdminLogout}
        onNavigate={navigate}
      />
    );
  } else if (view === "404") {
    page = <NotFoundPage onNavigate={navigate} />;
  } else {
    page = <HomePage currentGuest={auth.currentGuest} onNavigate={navigate} onLogout={handleLogout} />;
  }

  return (
    <>
      {page}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "8px",
            background: "#fff",
            color: "#171717",
            border: "1px solid #e5e7eb",
            fontSize: "0.95rem",
          },
          success: {
            iconTheme: { primary: "#15803d", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#b91c1c", secondary: "#fff" },
          },
        }}
      />
    </>
  );
}
