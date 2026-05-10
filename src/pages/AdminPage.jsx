import { useState } from "react";
import { ui } from "../styles/tokens";
import AdminLogin from "../components/admin/AdminLogin";
import AdminReservations from "../components/admin/AdminReservations";
import AdminRooms from "../components/admin/AdminRooms";
import AdminPromotions from "../components/admin/AdminPromotions";
import AdminMessages from "../components/admin/AdminMessages";
import AdminReviews from "../components/admin/AdminReviews";

const TABS = [
  { id: "reservations", label: "Reservas", Component: AdminReservations },
  { id: "rooms", label: "Habitaciones", Component: AdminRooms },
  { id: "promotions", label: "Promociones", Component: AdminPromotions },
  { id: "messages", label: "Mensajes", Component: AdminMessages },
  { id: "reviews", label: "Reseñas", Component: AdminReviews },
];

export default function AdminPage({ admin, onLogin, onLogout, onNavigate }) {
  const [activeTab, setActiveTab] = useState("reservations");

  if (!admin) {
    return <AdminLogin onLogin={onLogin} onCancel={() => onNavigate("inicio")} />;
  }

  const ActiveComponent = TABS.find((tab) => tab.id === activeTab)?.Component;

  return (
    <main className={ui.page}>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className={ui.eyebrow}>Hotel La Ceiba</p>
            <h1 className="text-2xl md:text-3xl font-bold">Panel de administración</h1>
            <p className="text-sm text-gray-600 mt-1">
              Sesión iniciada como <span className="font-semibold">{admin.name || admin.email}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onNavigate("inicio")}
              className="text-sm text-gray-600 hover:text-black"
            >
              Ver sitio
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 text-sm font-semibold text-red-700 hover:text-red-900"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-4 -mb-px flex gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? "border-green-700 text-green-700"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-8">
        {ActiveComponent ? <ActiveComponent /> : null}
      </section>
    </main>
  );
}
