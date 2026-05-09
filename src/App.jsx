import { useEffect, useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import PortalPage from "./pages/PortalPage";
import { useAuth } from "./hooks/useAuth";

const VIEWS = ["login", "registro", "portal"];

const getInitialView = () => {
  const hash = window.location.hash.replace("#", "");
  return VIEWS.includes(hash) ? hash : "inicio";
};

export default function App() {
  const [view, setView] = useState(getInitialView);
  const auth = useAuth();

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

  if (view === "portal" && !auth.currentGuest) {
    navigate("login");
    return null;
  }

  if (view === "login" || view === "registro") {
    return <AuthPage mode={view} auth={auth} onNavigate={navigate} />;
  }

  if (view === "portal" && auth.currentGuest) {
    return (
      <PortalPage
        guest={auth.currentGuest}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    );
  }

  return <HomePage currentGuest={auth.currentGuest} onNavigate={navigate} onLogout={handleLogout} />;
}
