import { ui } from "../styles/tokens";

export default function NotFoundPage({ onNavigate }) {
  return (
    <main className={`${ui.page} flex items-center justify-center px-4`}>
      <div className="max-w-xl text-center py-24">
        <p className={`${ui.eyebrow} mb-4`}>Error 404</p>
        <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-4">
          Página no encontrada
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          La sección que buscas no existe o fue movida. Vuelve al inicio para seguir explorando Hotel La Ceiba.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={() => onNavigate("inicio")}
            className={ui.primaryButton}
          >
            Ir al inicio
          </button>
          <button
            type="button"
            onClick={() => onNavigate("about")}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition"
          >
            Conoce el hotel
          </button>
        </div>
      </div>
    </main>
  );
}
