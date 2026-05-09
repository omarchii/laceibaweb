export default function Footer() {
  return (
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
            <p><a href="tel:+529997481294" className="hover:text-white transition">+52 999 748 1294</a></p>
            <p><a href="https://wa.me/529997481294" target="_blank" rel="noreferrer" className="hover:text-white transition">WhatsApp directo</a></p>
            <p><a href="mailto:laceibahotel@outlook.com" className="hover:text-white transition">laceibahotel@outlook.com</a></p>
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
  );
}
