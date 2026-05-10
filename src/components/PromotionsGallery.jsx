import { useEffect, useState } from "react";
import { ui } from "../styles/tokens";
import { requestJson } from "../services/api";
import { formatDate } from "../utils/dates";

export default function PromotionsGallery({ onReserve }) {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await requestJson("/api/promotions");
        if (!cancelled) setPromotions(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "No se pudieron cargar las promociones.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="promociones" className="bg-[#f9f9f9] py-16">
      <div className="max-w-6xl mx-auto px-4">
        <p className={`${ui.eyebrow} mb-3 text-center`}>Promociones vigentes</p>
        <h2 className="text-3xl font-semibold text-center mb-3">
          Aprovecha nuestras ofertas
        </h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Tarifas especiales por temporada, estancia larga y reservas anticipadas.
        </p>

        {isLoading && (
          <div className={`${ui.card} p-8 text-center text-gray-600`}>Cargando promociones...</div>
        )}

        {!isLoading && error && (
          <div className="rounded-md px-4 py-3 text-sm bg-red-50 text-red-800 border border-red-200">
            {error}
          </div>
        )}

        {!isLoading && !error && promotions.length === 0 && (
          <div className={`${ui.card} p-8 text-center text-gray-600`}>
            No hay promociones activas por ahora. ¡Vuelve pronto!
          </div>
        )}

        {!isLoading && !error && promotions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <article key={promo._id} className={`${ui.card} overflow-hidden flex flex-col`}>
                <div className="relative">
                  <img
                    src={promo.imageUrl || "/promo.jpg"}
                    alt={promo.title}
                    className="w-full h-48 object-cover"
                    onError={(event) => {
                      event.currentTarget.src = "/room.jpg";
                    }}
                  />
                  {promo.discount > 0 && (
                    <span className="absolute top-3 right-3 bg-[#F08A6B] text-white text-sm font-bold px-3 py-1 rounded-full shadow">
                      -{promo.discount}%
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-900">{promo.title}</h3>
                  <p className="mt-2 text-gray-700 flex-1">{promo.description}</p>
                  {promo.validUntil && (
                    <p className="mt-4 text-xs text-gray-500">
                      Válido hasta {formatDate(promo.validUntil)}
                    </p>
                  )}
                  {onReserve && (
                    <button
                      type="button"
                      onClick={onReserve}
                      className={`mt-5 w-full ${ui.primaryButton}`}
                    >
                      Reservar con esta promo
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
