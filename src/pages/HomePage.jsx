import { ui } from "../styles/tokens";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import AmenitiesSection from "../components/AmenitiesSection";
import WhyChooseUsSection from "../components/WhyChooseUsSection";

export default function HomePage({ currentGuest, onNavigate, onLogout }) {
  return (
    <main className="bg-white text-gray-800 font-sans">
      <Header currentGuest={currentGuest} onNavigate={onNavigate} onLogout={onLogout} />

      <section id="inicio" className="relative h-[80vh] w-full pt-20">
        <img
          src="/calkini.jpg"
          alt="Iglesia principal de Calkiní"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-white text-4xl md:text-5xl font-bold mb-4">
            Descansa en el corazón de Calkiní.
          </h2>
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl">
            Hotel La Ceiba, ubicación ideal y el mejor precio.
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
            <button
              type="button"
              onClick={() => onNavigate(currentGuest ? "portal" : "login")}
              className="mt-4 px-6 py-3 bg-green-700 text-white rounded-md text-center hover:bg-green-900 transition"
            >
              Reservar ahora
            </button>
          </div>
        </div>
      </section>

      <AmenitiesSection />
      <WhyChooseUsSection />
      <WhatsAppButton />
      <Footer />
    </main>
  );
}
