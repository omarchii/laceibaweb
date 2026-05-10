export default function WhyChooseUsSection() {
  return (
    <section id="baaxal-ha" className="bg-[#f9f9f9] py-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h3 className="text-3xl font-semibold mb-6 text-center">¿Por qué elegirnos?</h3>
        <p className="text-sm md:text-base text-gray-700 max-w-2xl mx-auto mb-10">
          Hospedándote con nosotros no solo aseguras un gran descanso, sino también diversión.
          ¡Disfruta de acceso preferencial y completamente gratis para pasar el día en <strong>Baaxal-Ha</strong>, un increíble parque acuático a solo unos minutos del hotel!
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            ["baaxal-ha-1.jpg", "Parque Acuático Baaxal-Ha 1"],
            ["baaxal-ha-2.jpg", "Atracciones Baaxal-Ha 2"],
            ["baaxal-ha-3.jpg", "Atracciones Baaxal-Ha 3"],
            ["baaxal-ha-4.jpeg", "Atracciones Baaxal-Ha 4"],
          ].map(([src, alt]) => (
            <div key={src} className="rounded-lg overflow-hidden shadow-sm border border-gray-200 aspect-square md:aspect-[4/3] bg-gray-200">
              <img src={`/${src}`} alt={alt} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
