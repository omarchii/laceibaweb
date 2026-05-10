import { ui } from "../styles/tokens";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

const VALORES = [
  {
    title: "Hospitalidad maya",
    text: "Cada huésped es recibido como familia. Atención cálida, respeto por la cultura local y disposición para que tu estancia se sienta como un segundo hogar.",
  },
  {
    title: "Calidad accesible",
    text: "Habitaciones cuidadas, limpias y bien equipadas a un precio justo. Creemos que descansar bien no debería ser un lujo.",
  },
  {
    title: "Comunidad",
    text: "Trabajamos con prestadores y artesanos de Calkiní, promoviendo el turismo local y las experiencias auténticas de Campeche.",
  },
];

const EQUIPO = [
  { nombre: "Familia Chi", rol: "Propietarios y anfitriones", initials: "FC" },
  { nombre: "Recepción 24/7", rol: "Atención y check-in exprés", initials: "R" },
  { nombre: "Housekeeping", rol: "Limpieza y desinfección diaria", initials: "H" },
];

export default function AboutPage({ currentGuest, onNavigate, onLogout }) {
  return (
    <main className="bg-white text-gray-800 font-sans">
      <Header currentGuest={currentGuest} onNavigate={onNavigate} onLogout={onLogout} />

      <section className="relative h-[55vh] w-full pt-20">
        <img
          src="/calkini.jpg"
          alt="Calkiní, Campeche"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <p className="text-sm uppercase tracking-wide text-white/80 font-bold mb-3">
            Quiénes somos
          </p>
          <h1 className="text-white text-4xl md:text-5xl font-bold max-w-3xl">
            Un hotel boutique en el corazón de Calkiní, Campeche.
          </h1>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <p className={`${ui.eyebrow} mb-3`}>Nuestra historia</p>
        <h2 className="text-3xl font-semibold mb-6">
          Más de una década recibiendo viajeros del sureste mexicano y del mundo.
        </h2>
        <div className="space-y-5 text-lg text-gray-700 leading-relaxed">
          <p>
            Hotel La Ceiba nació en 2012 como un proyecto familiar para ofrecer hospedaje cálido,
            seguro y bien ubicado en el municipio de Calkiní. Lo que empezó con seis habitaciones se
            transformó, año tras año, en un destino preferido por viajeros de negocios, turistas
            culturales y familias que visitan el parque acuático Baaxal-Ha.
          </p>
          <p>
            Hoy somos un equipo pequeño pero comprometido con un solo objetivo: que cada huésped se
            vaya con ganas de regresar. Cuidamos cada detalle —desde la limpieza diaria hasta la
            recepción de quien llega a las 11 de la noche— porque creemos que la hospitalidad se
            nota en lo que no se cobra.
          </p>
        </div>
      </section>

      <section className="bg-[#f9f9f9] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <p className={`${ui.eyebrow} mb-3 text-center`}>Nuestra misión</p>
          <h2 className="text-3xl font-semibold text-center mb-12">
            Lo que nos mueve cada día
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALORES.map((valor) => (
              <article
                key={valor.title}
                className={`${ui.card} p-6`}
              >
                <h3 className="text-xl font-semibold text-green-700 mb-3">{valor.title}</h3>
                <p className="text-gray-700">{valor.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <p className={`${ui.eyebrow} mb-3 text-center`}>El equipo</p>
        <h2 className="text-3xl font-semibold text-center mb-12">
          Las personas detrás de tu estancia
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EQUIPO.map((persona) => (
            <article
              key={persona.nombre}
              className={`${ui.card} p-6 text-center`}
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-700 text-white flex items-center justify-center text-2xl font-bold">
                {persona.initials}
              </div>
              <h3 className="text-lg font-semibold">{persona.nombre}</h3>
              <p className="text-sm text-gray-600 mt-1">{persona.rol}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#166534] text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-4">¿Listo para conocernos?</h2>
          <p className="text-white/90 mb-8 text-lg">
            Reserva en línea en unos minutos y déjanos cuidar tu descanso en Calkiní.
          </p>
          <button
            type="button"
            onClick={() => onNavigate(currentGuest ? "portal" : "login")}
            className={`${ui.coralButton} px-8 py-4 text-lg font-semibold`}
          >
            Reservar ahora
          </button>
        </div>
      </section>

      <WhatsAppButton />
      <Footer />
    </main>
  );
}
