import { ui } from "../styles/tokens";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import AmenitiesSection from "../components/AmenitiesSection";
import WhyChooseUsSection from "../components/WhyChooseUsSection";
import PromotionsGallery from "../components/PromotionsGallery";
import RoomsGallery from "../components/RoomsGallery";
import ReviewsSection from "../components/ReviewsSection";
import ContactForm from "../components/ContactForm";

export default function HomePage({ currentGuest, onNavigate, onLogout }) {
  const goReserve = () => onNavigate(currentGuest ? "portal" : "login");

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
          <button type="button" onClick={goReserve} className={`${ui.coralButton} px-8 py-4 text-lg font-semibold`}>
            Reservar ahora
          </button>
        </div>
      </section>

      <RoomsGallery onReserve={goReserve} />

      <AmenitiesSection />
      <WhyChooseUsSection />
      <PromotionsGallery onReserve={goReserve} />
      <ReviewsSection />
      <ContactForm />
      <WhatsAppButton />
      <Footer />
    </main>
  );
}
