import { useEffect } from "react";
import "./App.css"; // Archivo CSS 

export default function App() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://hotels.cloudbeds.com/widget/load/F4VPqo/vert?newWindow=1";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <main className="bg-white text-gray-800 font-sans">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo + nombre */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="Hotel La Ceiba"
              width="120"
              height="120"
              className="-ml-4 -my-8 z-10"
            />
            <span className="text-xl font-bold">Hotel La Ceiba</span>
          </div>

          {/* Links */}
          <ul className="hidden md:flex gap-8 text-gray-700">
            <li><a href="#inicio" className="hover:text-black transition">Inicio</a></li>
            <li><a href="#rooms" className="hover:text-black transition">Habitaciones</a></li>
            <li><a href="#servicios" className="hover:text-black transition">Servicios</a></li>
            <li><a href="#actividades" className="hover:text-black transition">¿Porqué elegirnos?</a></li>
            <li><a href="#contact" className="hover:text-black transition">Contacto</a></li>
          </ul>

          {/* CTA */}
          <a
            href="https://hotels.cloudbeds.com/reservation/F4VPqo"
            target="_blank"
            rel="noreferrer"
            className="bg-[#F08A6B] hover:bg-[#e6785a] text-white px-5 py-2 rounded-full transition"
          >
            Reserva
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section id="inicio" className="relative h-[80vh] w-full pt-20">
        <img
          src="/calkini.jpg"
          alt="Iglesia principal de Calkiní"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Texto */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-white text-4xl md:text-5xl font-bold mb-4">
            Descansa en el corazón de Calkiní.
          </h2>

          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl">
            Hotel La Ceiba, ubicación ideal y el mejor precio.
          </p>

          <a
            href="https://hotels.cloudbeds.com/widget/load/F4VPqo/float?newWindow=1"
            target="_blank"
            rel="noreferrer"
            className="bg-[#F08A6B] hover:bg-[#e6785a] text-white px-8 py-4 rounded-full text-lg font-semibold transition"
          >
            Reservar ahora
          </a>
        </div>
      </section>

      {/* HABITACIÓN */}
      <section id="rooms" className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-semibold mb-6 text-center">Habitación Doble</h3>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <img
            src="/room.jpg"
            alt="Habitación doble Hotel La Ceiba"
            className="rounded-lg object-cover w-full md:w-[600px] h-auto"
          />

          <div className="flex flex-col justify-between">
            <p className="text-gray-700">
              Habitación cómoda con aire acondicionado, agua caliente, smart TV e internet.
            </p>

            <p className="text-2xl font-bold mt-4">$599 MXN / noche</p>

            <a
              href="https://hotels.cloudbeds.com/reservation/F4VPqo"
              target="_blank"
              rel="noreferrer"
              className="mt-4 px-6 py-3 bg-green-700 text-white rounded-md text-center hover:bg-green-900 transition"
            >
              Reservar ahora
            </a>
          </div>
        </div>
      </section>

      {/* SERVICIOS / AMENIDADES */}
      <section id="servicios" className="max-w-7xl mx-auto px-4 py-16 text-center border-t border-b border-gray-100 my-10 bg-[#FFFFFF]">
        <h3 className="text-3xl font-semibold mb-6 text-center">Servicios y Amenidades</h3>
        <div className="amenities-grid px-4 py-4">
          <div className="amenity-item">
            <svg className="amenity-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
            <span>Aire acondicionado</span>
          </div>
          <div className="amenity-item">
            <svg className="amenity-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
            <span>Cambio de toallas bajo solicitud</span>
          </div>
          <div className="amenity-item">
            <svg className="amenity-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            <span>CCTV en áreas comunes</span>
          </div>
          <div className="amenity-item">
            <svg className="amenity-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            <span>CCTV en exteriores de la propiedad</span>
          </div>

          <div className="amenity-item">
            <svg className="amenity-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Check-in y check-out exprés</span>
          </div>
          <div className="amenity-item">
            <svg className="amenity-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span>Conserje</span>
          </div>
          <div className="amenity-item">
            <svg className="amenity-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <span>Detectores de humo</span>
          </div>

          <div className="amenity-item">
            <svg className="amenity-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            <span>Estacionamiento accesible</span>
          </div>
          <div className="amenity-item">
            <svg className="amenity-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            <span>Estacionamiento para huéspedes</span>
          </div>
          <div className="amenity-item">
            <svg className="amenity-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" /></svg>
            <span>Extintores de incendio</span>
          </div>
          <div className="amenity-item">
            <svg className="amenity-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span>Facturas</span>
          </div>

          <div className="amenity-item">
            <svg className="amenity-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            <span>Habitaciones libres de humo</span>
          </div>
          <div className="amenity-item">
            <svg className="amenity-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            <span>Impresora</span>
          </div>
          <div className="amenity-item">
            <svg className="amenity-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
            <span>Internet</span>
          </div>
          <div className="amenity-item">
            <svg className="amenity-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            <span>Las habitaciones se desinfectan a diario</span>
          </div>
        </div>
      </section>

      {/* ¿POR QUÉ ELEGIRNOS? / BAAXAL-HA */}
      <section id="actividades" className="bg-[#f9f9f9] py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-semibold mb-6 text-center">¿Por qué elegirnos?</h3>
          <p className="text-sm md:text-base text-gray-700 max-w-2xl mx-auto mb-10">
            Hospedándote con nosotros no solo aseguras un gran descanso, sino también diversión.
            ¡Disfruta de acceso preferencial y completamente gratis para pasar el día en <strong>Baaxal-Ha</strong>, un increíble parque acuático a solo unos minutos del hotel!
          </p>

          {/* Imagenes */}
          <div id="baaxal-ha" className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {/* Imagen 1 */}
            <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 aspect-square md:aspect-[4/3] bg-gray-200">
              <img
                src="/baaxal-ha-1.jpg"
                alt="Parque Acuático Baaxal-Ha 1"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Imagen 2 */}
            <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 aspect-square md:aspect-[4/3] bg-gray-200">
              <img
                src="/baaxal-ha-2.jpg"
                alt="Atracciones Baaxal-Ha 2"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Imagen 3 */}
            <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 aspect-square md:aspect-[4/3] bg-gray-200">
              <img
                src="/baaxal-ha-3.jpg"
                alt="Atracciones Baaxal-Ha 3"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Imagen 4 */}
            <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 aspect-square md:aspect-[4/3] bg-gray-200">
              <img
                src="/baaxal-ha-4.jpeg"
                alt="Atracciones Baaxal-Ha 4"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BOTÓN WHATSAPP */}
      <a
        href="https://wa.me/529997481294"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-2xl hover:bg-green-600 transition"
      >
        <img src="/whatsapp.svg" alt="WhatsApp" className="w-12 h-12" />
      </a>

      {/* FOOTER */}
      <footer id="contact" className="bg-gray-900 text-gray-300 mt-20 pt-14 pb-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Hotel La Ceiba</h3>
            <p className="text-gray-400">
              Calle 24, Barrio Kilakán <br />
              Calkiní, Campeche, México <br />
              CP 24900
            </p>

            <div className="mt-4 space-y-2">
              <p>
                <a href="tel:+529997481294" className="hover:text-white transition">
                  +52 999 748 1294
                </a>
              </p>
              <p>
                <a href="https://wa.me/529997481294" target="_blank" rel="noreferrer" className="hover:text-white transition">
                  WhatsApp directo
                </a>
              </p>
              <p>
                <a href="mailto:laceibahotel@outlook.com" className="hover:text-white transition">
                  laceibahotel@outlook.com
                </a>
              </p>
            </div>

            <div className="flex gap-4 mt-5">
              <img src="/facebook.svg" alt="Facebook" className="w-6 h-6" />
            </div>

            <div className="mt-6">
              <h4 className="text-white font-semibold mb-2">Horarios</h4>
              <p className="text-gray-400">Check-in: 3:00 PM</p>
              <p className="text-gray-400">Check-out: 12:00 PM</p>
              <p className="text-gray-400 mt-2">Recepción 6:00 – 23:59</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Enlaces</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#inicio" className="hover:text-white transition">Inicio</a></li>
              <li><a href="#rooms" className="hover:text-white transition">Habitaciones</a></li>
              <li><a href="#baaxal-ha" className="hover:text-white transition">Baaxal-Ha</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Ubicación</h3>
            <iframe
              title="Mapa Hotel La Ceiba"
              src="https://www.google.com/maps?q=Hotel+La+Ceiba+Calkiní+Campeche&output=embed"
              width="100%"
              height="200"
              loading="lazy"
              style={{ border: 0 }}
            />
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm mt-10">
          © {new Date().getFullYear()} Hotel La Ceiba — Calkiní, Campeche.
        </div>
      </footer>
    </main>
  );
}