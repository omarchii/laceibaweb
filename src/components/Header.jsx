import { ui } from "../styles/tokens";

export default function Header({ currentGuest, onNavigate, onLogout }) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button type="button" onClick={() => onNavigate("inicio")} className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="Hotel La Ceiba"
            width="120"
            height="120"
            className="-ml-4 -my-8 z-10"
          />
          <span className="text-xl font-bold">Hotel La Ceiba</span>
        </button>

        <ul className="hidden md:flex gap-8 text-gray-700">
          <li>
            <button type="button" onClick={() => onNavigate("inicio")} className="hover:text-black transition">
              Inicio
            </button>
          </li>
          <li>
            <button type="button" onClick={() => onNavigate("about")} className="hover:text-black transition">
              Quiénes somos
            </button>
          </li>
          <li><a href="#rooms" className="hover:text-black transition">Habitaciones</a></li>
          <li><a href="#promociones" className="hover:text-black transition">Promociones</a></li>
          <li><a href="#resenas" className="hover:text-black transition">Reseñas</a></li>
          <li><a href="#contacto" className="hover:text-black transition">Contacto</a></li>
        </ul>

        {currentGuest ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate("portal")}
              className={`${ui.coralButton} px-5 py-2`}
            >
              Mi reserva
            </button>
            <button type="button" onClick={onLogout} className="hidden md:block text-sm text-gray-600 hover:text-black">
              Salir
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate("login")}
            className={`${ui.coralButton} px-5 py-2`}
          >
            Reservar
          </button>
        )}
      </div>
    </nav>
  );
}
