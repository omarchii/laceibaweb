export default function AmenitiesSection() {
  return (
    <section id="servicios" className="max-w-7xl mx-auto px-4 py-16 text-center border-t border-b border-gray-100 my-10 bg-[#FFFFFF]">
      <h3 className="text-3xl font-semibold mb-6 text-center">Servicios y Amenidades</h3>
      <div className="amenities-grid px-4 py-4">
        {[
          "Aire acondicionado",
          "Cambio de toallas bajo solicitud",
          "CCTV en áreas comunes",
          "CCTV en exteriores de la propiedad",
          "Check-in y check-out exprés",
          "Conserje",
          "Detectores de humo",
          "Estacionamiento accesible",
          "Estacionamiento para huéspedes",
          "Extintores de incendio",
          "Facturas",
          "Habitaciones libres de humo",
          "Impresora",
          "Internet",
          "Las habitaciones se desinfectan a diario",
        ].map((amenity) => (
          <div className="amenity-item" key={amenity}>
            <svg className="amenity-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
