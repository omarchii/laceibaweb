import { useEffect, useState } from "react";
import { requestJson } from "../services/api";
import { ui } from "../styles/tokens";

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });

const ROOM_ORDER = ["Sencilla", "Doble", "Suite"];

export default function RoomsGallery({ onReserve }) {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    requestJson("/api/rooms")
      .then((data) => {
        if (cancelled) return;
        const sorted = [...data].sort(
          (a, b) => ROOM_ORDER.indexOf(a.type) - ROOM_ORDER.indexOf(b.type)
        );
        setRooms(sorted);
      })
      .catch(() => {
        if (!cancelled) setRooms([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="rooms" className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <p className={`${ui.eyebrow} mb-3 text-center`}>Nuestras habitaciones</p>
        <h2 className="text-3xl font-semibold text-center mb-12">
          Elige la habitación ideal para tu estancia
        </h2>

        {isLoading ? (
          <div className={`${ui.card} p-8 text-center text-gray-600`}>
            Cargando habitaciones...
          </div>
        ) : rooms.length === 0 ? (
          <div className={`${ui.card} p-8 text-center text-gray-600`}>
            Por el momento no hay habitaciones disponibles.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <article key={room._id} className={`${ui.card} overflow-hidden flex flex-col`}>
                <img
                  src={room.imageUrl || "/room.jpg"}
                  alt={room.name}
                  className="w-full h-52 object-cover"
                />
                <div className="p-6 flex-1 flex flex-col">
                  <p className={ui.eyebrow}>{room.type}</p>
                  <h3 className="text-xl font-semibold mt-1">{room.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Hasta {room.capacity} {room.capacity === 1 ? "huésped" : "huéspedes"}
                  </p>
                  {room.amenities?.length > 0 && (
                    <ul className="text-sm text-gray-700 mt-3 space-y-1 flex-1">
                      {room.amenities.slice(0, 4).map((amenity) => (
                        <li key={amenity}>· {amenity}</li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-2xl font-bold">{formatMoney(room.pricePerNight)}</p>
                      <p className="text-xs text-gray-500">por noche</p>
                    </div>
                    <button
                      type="button"
                      onClick={onReserve}
                      className={`${ui.primaryButton} px-5 py-2 text-sm`}
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
