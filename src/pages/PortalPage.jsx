import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ui } from "../styles/tokens";
import TextField from "../components/TextField";
import SummaryRow from "../components/SummaryRow";
import StatusBadge from "../components/StatusBadge";
import ReviewForm from "../components/ReviewForm";
import PaymentModal from "../components/PaymentModal";
import { requestJson, uploadFile, API_URL } from "../services/api";
import { formatDate, getNights } from "../utils/dates";
import { generateReceipt } from "../utils/receipt";

const DEFAULT_ROOMS = [
  {
    name: "Habitación Sencilla",
    type: "Sencilla",
    pricePerNight: 499,
    stock: 20,
    capacity: 2,
    amenities: ["Aire acondicionado", "Internet", "TV"],
    isAvailable: true,
    imageUrl: "/room2",
  },
  {
    name: "Habitación Doble",
    type: "Doble",
    pricePerNight: 599,
    stock: 20,
    capacity: 4,
    amenities: ["Aire acondicionado", "Internet", "TV", "Agua caliente"],
    isAvailable: true,
    imageUrl: "/room.jpg",
  },
  {
    name: "Suite La Ceiba",
    type: "Suite",
    pricePerNight: 999,
    stock: 5,
    capacity: 4,
    amenities: [
      "Aire acondicionado",
      "Smart TV",
      "Agua caliente",
      "Internet de alta velocidad",
      "Sala privada",
      "Vista panorámica",
    ],
    isAvailable: true,
    imageUrl: "/room.jpg",
  },
];

const today = () => new Date().toISOString().slice(0, 10);

const emptyBookingForm = {
  roomId: "",
  checkInDate: "",
  checkOutDate: "",
  numberOfGuests: 1,
};

const emptyFilters = {
  maxPrice: "",
  minCapacity: "",
};

export default function PortalPage({ guest, onNavigate, onLogout }) {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [bookingForm, setBookingForm] = useState(emptyBookingForm);
  const [filters, setFilters] = useState(emptyFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payingReservation, setPayingReservation] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [currentGuest, setCurrentGuest] = useState(guest);
  const [isUploading, setIsUploading] = useState(false);

  const loadPortalData = async () => {
    setIsLoading(true);
    try {
      let roomData = await requestJson("/api/rooms");

      const normalizedRooms = await Promise.all(
        DEFAULT_ROOMS.map(async (defaultRoom) => {
          const existingRoom = roomData.find((room) => room.name === defaultRoom.name);
          if (existingRoom) {
            return requestJson(`/api/rooms/${existingRoom._id}`, {
              method: "PUT",
              body: JSON.stringify({ ...existingRoom, ...defaultRoom }),
            });
          }
          return requestJson("/api/rooms", {
            method: "POST",
            body: JSON.stringify(defaultRoom),
          });
        })
      );
      roomData = normalizedRooms;

      const reservationData = await requestJson("/api/reservations");
      setRooms(roomData);
      setReservations(reservationData);
      setBookingForm((current) => ({
        ...current,
        roomId: current.roomId || roomData[0]?._id || "",
      }));
    } catch (error) {
      toast.error(error.message || "No se pudo cargar el portal.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRooms = useMemo(() => {
    const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;
    const minCapacity = filters.minCapacity ? Number(filters.minCapacity) : null;
    return rooms.filter((room) => {
      if (maxPrice !== null && room.pricePerNight > maxPrice) return false;
      if (minCapacity !== null && room.capacity < minCapacity) return false;
      return true;
    });
  }, [rooms, filters]);

  const selectedRoom = useMemo(() => {
    return rooms.find((room) => room._id === bookingForm.roomId) || rooms[0];
  }, [rooms, bookingForm.roomId]);

  const nights = getNights(bookingForm.checkInDate, bookingForm.checkOutDate);
  const totalPrice = selectedRoom ? nights * selectedRoom.pricePerNight : 0;

  const roomAvailability = useMemo(() => {
    const activeReservationsByRoom = reservations.reduce((acc, reservation) => {
      if (reservation.status === "Cancelada") return acc;
      const roomId = reservation.room?._id || reservation.room;
      if (!roomId) return acc;
      acc[roomId] = (acc[roomId] || 0) + 1;
      return acc;
    }, {});

    return rooms.reduce((acc, room) => {
      const reserved = activeReservationsByRoom[room._id] || 0;
      const stock = room.stock ?? 20;
      acc[room._id] = {
        reserved,
        stock,
        remaining: Math.max(stock - reserved, 0),
      };
      return acc;
    }, {});
  }, [rooms, reservations]);

  const selectedRoomRemaining = selectedRoom
    ? roomAvailability[selectedRoom._id]?.remaining ?? selectedRoom.stock ?? 20
    : 0;

  const myReservations = reservations.filter((reservation) => {
    const guestId = reservation.guest?._id || reservation.guest;
    return guestId === currentGuest?._id;
  });

  const canReview = myReservations.length > 0;

  const handleBookingChange = (event) => {
    const { name, value } = event.target;
    setBookingForm((current) => ({ ...current, [name]: value }));
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleSelectRoom = (roomId) => {
    setBookingForm((current) => ({ ...current, roomId }));
  };

  const handleCreateReservation = async (event) => {
    event.preventDefault();

    if (!selectedRoom) {
      toast.error("Selecciona una habitación disponible.");
      return;
    }
    if (!bookingForm.checkInDate || !bookingForm.checkOutDate) {
      toast.error("Selecciona las fechas de llegada y salida.");
      return;
    }
    if (bookingForm.checkInDate < today()) {
      toast.error("La fecha de llegada no puede ser anterior a hoy.");
      return;
    }
    if (nights <= 0) {
      toast.error("La fecha de salida debe ser posterior a la de llegada.");
      return;
    }
    const guestsRequested = Number(bookingForm.numberOfGuests);
    if (!guestsRequested || guestsRequested < 1) {
      toast.error("Indica al menos un huésped.");
      return;
    }
    if (guestsRequested > selectedRoom.capacity) {
      toast.error(`La habitación solo admite hasta ${selectedRoom.capacity} huéspedes.`);
      return;
    }
    if (selectedRoomRemaining <= 0) {
      toast.error("Esta habitación ya no tiene disponibilidad.");
      return;
    }

    setIsSubmitting(true);
    try {
      await requestJson("/api/reservations", {
        method: "POST",
        body: JSON.stringify({
          guest: currentGuest._id,
          room: selectedRoom._id,
          checkInDate: new Date(`${bookingForm.checkInDate}T15:00:00`).toISOString(),
          checkOutDate: new Date(`${bookingForm.checkOutDate}T12:00:00`).toISOString(),
          numberOfGuests: guestsRequested,
          totalPrice,
          status: "Pendiente",
        }),
      });
      toast.success(`Reservación registrada por $${totalPrice} MXN.`);
      setBookingForm((current) => ({ ...emptyBookingForm, roomId: current.roomId }));
      await loadPortalData();
    } catch (error) {
      toast.error(error.message || "No se pudo guardar la reservación.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    setIsSubmitting(true);
    try {
      await requestJson(`/api/reservations/${reservationId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "Cancelada" }),
      });
      toast.success("Reservación cancelada.");
      await loadPortalData();
    } catch (error) {
      toast.error(error.message || "No se pudo cancelar la reservación.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPayment = async (reservation) => {
    setIsPaying(true);
    try {
      await requestJson(`/api/reservations/${reservation._id}/pay`, {
        method: "PATCH",
      });
      toast.success("Pago aprobado. Reservación confirmada.");
      setPayingReservation(null);
      await loadPortalData();
    } catch (error) {
      toast.error(error.message || "No se pudo procesar el pago.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleDocumentUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const data = await uploadFile(`/api/guests/${currentGuest._id}/document`, file);
      const updatedGuest = { ...currentGuest, idDocument: data.idDocument };
      setCurrentGuest(updatedGuest);
      localStorage.setItem("laceibaGuest", JSON.stringify(updatedGuest));
      toast.success("Documento subido correctamente.");
    } catch (error) {
      toast.error(error.message || "No se pudo subir el documento.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleDownloadReceipt = (reservation) => {
    try {
      generateReceipt(reservation, currentGuest);
    } catch {
      toast.error("No se pudo generar el comprobante.");
    }
  };

  return (
    <main className={ui.page}>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button type="button" onClick={() => onNavigate("inicio")} className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-full bg-green-700 flex items-center justify-center">
              <img src="/logo.svg" alt="Hotel La Ceiba" width="48" height="48" />
            </span>
            <span className="text-xl font-bold">Hotel La Ceiba</span>
          </button>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm text-gray-600">
              {currentGuest.firstName} {currentGuest.lastName}
            </span>
            <button type="button" onClick={onLogout} className="text-sm font-semibold text-green-700 hover:text-green-900">
              Salir
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className={`${ui.eyebrow} mb-2`}>Portal de huésped</p>
          <h1 className="text-4xl font-bold text-gray-900">Reserva tu habitación</h1>
        </div>

        {isLoading ? (
          <div className={`${ui.card} p-8`}>Cargando habitaciones...</div>
        ) : (
          <>
            <section className={`${ui.card} p-5 mb-6`}>
              <p className={`${ui.eyebrow} mb-3`}>Filtrar habitaciones</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <TextField
                  label="Precio máximo por noche (MXN)"
                  name="maxPrice"
                  type="number"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
                <TextField
                  label="Capacidad mínima"
                  name="minCapacity"
                  type="number"
                  value={filters.minCapacity}
                  onChange={handleFilterChange}
                />
                <button
                  type="button"
                  onClick={() => setFilters(emptyFilters)}
                  className="text-sm font-semibold text-green-700 hover:text-green-900 self-center md:justify-self-start"
                >
                  Limpiar filtros
                </button>
              </div>
              {filteredRooms.length === 0 && (
                <p className="mt-3 text-sm text-gray-600">
                  Ninguna habitación coincide con los filtros aplicados.
                </p>
              )}
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {filteredRooms.map((room) => {
                const availability = roomAvailability[room._id] || {
                  stock: room.stock ?? 20,
                  reserved: 0,
                  remaining: room.stock ?? 20,
                };

                return (
                  <article
                    key={room._id}
                    className={`bg-white border rounded-lg shadow-sm overflow-hidden ${
                      selectedRoom?._id === room._id ? "border-green-700 ring-2 ring-green-700/10" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={room.imageUrl || "/room.jpg"}
                      alt={room.name}
                      className="w-full h-48 object-cover"
                      onError={(event) => {
                        event.currentTarget.src = "/room.jpg";
                      }}
                    />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-semibold">{room.name}</h2>
                          <p className="text-sm text-gray-500">{room.type} · hasta {room.capacity} huéspedes</p>
                        </div>
                        <strong className="text-green-700">${room.pricePerNight}</strong>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="rounded-md bg-gray-50 px-2 py-2">
                          <span className="block font-bold text-gray-900">{availability.stock}</span>
                          <span className="text-gray-500">stock</span>
                        </div>
                        <div className="rounded-md bg-gray-50 px-2 py-2">
                          <span className="block font-bold text-gray-900">{availability.reserved}</span>
                          <span className="text-gray-500">reservadas</span>
                        </div>
                        <div className="rounded-md bg-green-50 px-2 py-2">
                          <span className="block font-bold text-green-800">{availability.remaining}</span>
                          <span className="text-green-800">restantes</span>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(room.amenities || []).slice(0, 3).map((amenity) => (
                          <span key={amenity} className="text-xs bg-green-50 text-green-800 px-2 py-1 rounded-full">
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectRoom(room._id)}
                        disabled={availability.remaining <= 0}
                        className={`mt-5 w-full ${ui.primaryButton}`}
                      >
                        {availability.remaining <= 0 ? "Sin disponibilidad" : "Seleccionar"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
              <form onSubmit={handleCreateReservation} className={`${ui.card} p-6 md:p-8`}>
                <h2 className="text-2xl font-semibold mb-6">Datos de estancia</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <TextField
                    label="Llegada"
                    name="checkInDate"
                    type="date"
                    value={bookingForm.checkInDate}
                    onChange={handleBookingChange}
                    required
                  />
                  <TextField
                    label="Salida"
                    name="checkOutDate"
                    type="date"
                    value={bookingForm.checkOutDate}
                    onChange={handleBookingChange}
                    required
                  />
                  <TextField
                    label={`Número de huéspedes${selectedRoom ? ` (máx ${selectedRoom.capacity})` : ""}`}
                    name="numberOfGuests"
                    type="number"
                    value={bookingForm.numberOfGuests}
                    onChange={handleBookingChange}
                    required
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className={`mt-6 w-full md:w-auto ${ui.primaryButton}`}>
                  {isSubmitting ? "Guardando..." : "Reservar habitación"}
                </button>
              </form>

              <aside className={`${ui.card} p-6`}>
                <p className={ui.eyebrow}>Resumen</p>
                <h3 className="text-2xl font-semibold mt-2">{selectedRoom?.name || "Habitación"}</h3>
                <div className="mt-5 space-y-3 text-gray-700">
                  <SummaryRow label="Noches" value={nights} />
                  <SummaryRow label="Huéspedes" value={bookingForm.numberOfGuests || 1} />
                  <SummaryRow label="Precio por noche" value={`$${selectedRoom?.pricePerNight || 0} MXN`} />
                  <SummaryRow label="Disponibles" value={selectedRoomRemaining} />
                  <div className="border-t border-gray-200 pt-3 flex justify-between gap-4 text-lg">
                    <span>Total</span>
                    <strong className="text-green-700">${totalPrice} MXN</strong>
                  </div>
                </div>
              </aside>
            </section>

            <section className={`mt-10 ${ui.card} p-6 md:p-8`}>
              <h2 className="text-2xl font-semibold mb-2">Documento de identidad</h2>
              <p className="text-sm text-gray-600 mb-4">
                Sube una foto o PDF de tu INE/pasaporte para agilizar el check-in (máx 5 MB).
              </p>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-white bg-green-700 hover:bg-green-900 transition px-5 py-2.5 rounded-md">
                  <span>{isUploading ? "Subiendo..." : "Subir documento"}</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleDocumentUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
                {currentGuest.idDocument ? (
                  <a
                    href={`${API_URL}${currentGuest.idDocument}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-green-700 hover:text-green-900"
                  >
                    Ver documento subido
                  </a>
                ) : (
                  <span className="text-sm text-gray-500">Sin documento registrado.</span>
                )}
              </div>
            </section>

            <section className={`mt-10 ${ui.card} p-6 md:p-8`}>
              <h2 className="text-2xl font-semibold mb-6">Mis reservaciones</h2>
              {myReservations.length === 0 ? (
                <p className="text-gray-600">Todavía no tienes reservaciones registradas.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myReservations.map((reservation) => (
                    <article key={reservation._id} className="border border-gray-200 rounded-lg p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">{reservation.room?.name || "Habitación"}</h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(reservation.checkInDate)} - {formatDate(reservation.checkOutDate)}
                          </p>
                          {reservation.numberOfGuests && (
                            <p className="text-xs text-gray-500 mt-1">
                              {reservation.numberOfGuests} huésped{reservation.numberOfGuests > 1 ? "es" : ""}
                            </p>
                          )}
                        </div>
                        <StatusBadge status={reservation.status} />
                      </div>
                      <p className="mt-4 font-bold">${reservation.totalPrice} MXN</p>
                      <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                        {reservation.status === "Pendiente" && (
                          <button
                            type="button"
                            onClick={() => setPayingReservation(reservation)}
                            className="text-green-700 hover:text-green-900"
                          >
                            Pagar y confirmar
                          </button>
                        )}
                        {reservation.status === "Confirmada" && (
                          <button
                            type="button"
                            onClick={() => handleDownloadReceipt(reservation)}
                            className="text-green-700 hover:text-green-900"
                          >
                            Descargar comprobante
                          </button>
                        )}
                        {reservation.status !== "Cancelada" && (
                          <button
                            type="button"
                            onClick={() => handleCancelReservation(reservation._id)}
                            disabled={isSubmitting}
                            className="text-red-700 hover:text-red-900"
                          >
                            Cancelar reservación
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <ReviewForm canReview={canReview} />
          </>
        )}
      </div>

      <PaymentModal
        reservation={payingReservation}
        onClose={() => setPayingReservation(null)}
        onConfirm={handleConfirmPayment}
        isProcessing={isPaying}
      />
    </main>
  );
}
