import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const ui = {
  page: "min-h-screen bg-[#f9f9f9] text-gray-800 font-sans",
  card: "bg-white border border-gray-200 rounded-lg shadow-sm",
  input: "mt-2 w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/10",
  primaryButton: "px-8 py-3 bg-green-700 text-white rounded-md font-semibold hover:bg-green-900 transition disabled:cursor-not-allowed disabled:bg-gray-400",
  coralButton: "bg-[#F08A6B] hover:bg-[#e6785a] text-white rounded-full transition",
  eyebrow: "text-sm uppercase tracking-wide text-green-700 font-bold",
};

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
];

const emptyAuthForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const emptyBookingForm = {
  roomId: "",
  checkInDate: "",
  checkOutDate: "",
};

const getInitialView = () => {
  const hash = window.location.hash.replace("#", "");
  return ["login", "registro", "portal"].includes(hash) ? hash : "inicio";
};

const getNights = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) return 0;

  const start = new Date(`${checkInDate}T00:00:00`);
  const end = new Date(`${checkOutDate}T00:00:00`);
  const diff = end.getTime() - start.getTime();

  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
};

const formatDate = (value) => {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export default function App() {
  const [view, setView] = useState(getInitialView);
  const [currentGuest, setCurrentGuest] = useState(() => {
    const storedGuest = localStorage.getItem("laceibaGuest");
    return storedGuest ? JSON.parse(storedGuest) : null;
  });
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [authForm, setAuthForm] = useState(emptyAuthForm);
  const [bookingForm, setBookingForm] = useState(emptyBookingForm);
  const [authStatus, setAuthStatus] = useState({ type: "", message: "" });
  const [portalStatus, setPortalStatus] = useState({ type: "", message: "" });
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const syncView = () => setView(getInitialView());
    window.addEventListener("hashchange", syncView);
    return () => window.removeEventListener("hashchange", syncView);
  }, []);

  useEffect(() => {
    if (view === "portal" && !currentGuest) {
      navigate("login");
    }
  }, [view, currentGuest]);

  useEffect(() => {
    if (view !== "portal" || !currentGuest) return;
    loadPortalData();
  }, [view, currentGuest]);

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
  const selectedRoomRemaining = selectedRoom ? roomAvailability[selectedRoom._id]?.remaining ?? selectedRoom.stock ?? 20 : 0;

  const myReservations = reservations.filter((reservation) => {
    const guestId = reservation.guest?._id || reservation.guest;
    return guestId === currentGuest?._id;
  });

  const navigate = (nextView) => {
    window.location.hash = nextView;
    setView(nextView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const requestJson = async (path, options = {}) => {
    let response;

    try {
      response = await fetch(`${API_URL}${path}`, {
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });
    } catch {
      throw new Error("No se pudo conectar con el backend. Verifica que esté corriendo en http://localhost:5001.");
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Ocurrió un error");

    return data;
  };

  const loadPortalData = async () => {
    setIsLoadingPortal(true);

    try {
      let roomData = await requestJson("/api/rooms");

      const normalizedRooms = await Promise.all(
        DEFAULT_ROOMS.map(async (defaultRoom) => {
          const existingRoom = roomData.find((room) => room.name === defaultRoom.name);

          if (existingRoom) {
            return requestJson(`/api/rooms/${existingRoom._id}`, {
              method: "PUT",
              body: JSON.stringify({
                ...existingRoom,
                ...defaultRoom,
              }),
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
      setPortalStatus({
        type: "error",
        message: error.message || "No se pudo cargar el portal.",
      });
    } finally {
      setIsLoadingPortal(false);
    }
  };

  const handleAuthChange = (event) => {
    const { name, value } = event.target;
    setAuthForm((current) => ({ ...current, [name]: value }));
  };

  const handleBookingChange = (event) => {
    const { name, value } = event.target;
    setBookingForm((current) => ({ ...current, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setAuthStatus({ type: "", message: "" });

    try {
      const guest = await requestJson("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: authForm.email.trim(),
          password: authForm.password,
        }),
      });

      localStorage.setItem("laceibaGuest", JSON.stringify(guest));
      setCurrentGuest(guest);
      setAuthForm(emptyAuthForm);
      navigate("portal");
    } catch (error) {
      setAuthStatus({ type: "error", message: error.message || "No se pudo iniciar sesión." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setAuthStatus({ type: "", message: "" });

    if (authForm.password.length < 6) {
      setAuthStatus({ type: "error", message: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }

    if (authForm.password !== authForm.confirmPassword) {
      setAuthStatus({ type: "error", message: "Las contraseñas no coinciden." });
      return;
    }

    setIsSubmitting(true);

    try {
      const guest = await requestJson("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          firstName: authForm.firstName.trim(),
          lastName: authForm.lastName.trim(),
          email: authForm.email.trim(),
          phone: authForm.phone.trim(),
          password: authForm.password,
        }),
      });

      localStorage.setItem("laceibaGuest", JSON.stringify(guest));
      setCurrentGuest(guest);
      setAuthForm(emptyAuthForm);
      navigate("portal");
    } catch (error) {
      setAuthStatus({ type: "error", message: error.message || "No se pudo crear la cuenta." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("laceibaGuest");
    setCurrentGuest(null);
    setReservations([]);
    setBookingForm(emptyBookingForm);
    navigate("inicio");
  };

  const handleCreateReservation = async (event) => {
    event.preventDefault();
    setPortalStatus({ type: "", message: "" });

    if (!currentGuest || !selectedRoom) {
      setPortalStatus({ type: "error", message: "Selecciona una habitación disponible." });
      return;
    }

    if (nights <= 0) {
      setPortalStatus({ type: "error", message: "Selecciona fechas válidas para la reservación." });
      return;
    }

    if (selectedRoomRemaining <= 0) {
      setPortalStatus({ type: "error", message: "Esta habitación ya no tiene disponibilidad." });
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
          totalPrice,
          status: "Pendiente",
        }),
      });

      setPortalStatus({
        type: "success",
        message: `Reservación registrada por $${totalPrice} MXN.`,
      });
      setBookingForm((current) => ({
        ...emptyBookingForm,
        roomId: current.roomId,
      }));
      await loadPortalData();
    } catch (error) {
      setPortalStatus({ type: "error", message: error.message || "No se pudo guardar la reservación." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    setIsSubmitting(true);
    setPortalStatus({ type: "", message: "" });

    try {
      await requestJson(`/api/reservations/${reservationId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "Cancelada" }),
      });
      setPortalStatus({ type: "success", message: "Reservación cancelada." });
      await loadPortalData();
    } catch (error) {
      setPortalStatus({ type: "error", message: error.message || "No se pudo cancelar la reservación." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (view === "login") {
    return (
      <AuthPage
        mode="login"
        form={authForm}
        status={authStatus}
        isSubmitting={isSubmitting}
        onChange={handleAuthChange}
        onSubmit={handleLogin}
        onNavigate={navigate}
      />
    );
  }

  if (view === "registro") {
    return (
      <AuthPage
        mode="registro"
        form={authForm}
        status={authStatus}
        isSubmitting={isSubmitting}
        onChange={handleAuthChange}
        onSubmit={handleRegister}
        onNavigate={navigate}
      />
    );
  }

  if (view === "portal" && currentGuest) {
    return (
      <PortalPage
        guest={currentGuest}
        rooms={rooms}
        selectedRoom={selectedRoom}
        bookingForm={bookingForm}
        nights={nights}
        totalPrice={totalPrice}
        roomAvailability={roomAvailability}
        selectedRoomRemaining={selectedRoomRemaining}
        reservations={myReservations}
        status={portalStatus}
        isLoading={isLoadingPortal}
        isSubmitting={isSubmitting}
        onChange={handleBookingChange}
        onSelectRoom={(roomId) => setBookingForm((current) => ({ ...current, roomId }))}
        onSubmit={handleCreateReservation}
        onCancel={handleCancelReservation}
        onLogout={handleLogout}
        onNavigate={navigate}
      />
    );
  }

  return <HomePage currentGuest={currentGuest} onNavigate={navigate} onLogout={handleLogout} />;
}

function Header({ currentGuest, onNavigate, onLogout }) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button type="button" onClick={() => onNavigate("inicio")} className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="Hotel La Ceiba"
            width="120"
            height="120"
            className="-ml-4 -my-8 z-10"
          />
          <span className="text-xl font-bold">Hotel La Ceiba</span>
        </button>

        <ul className="hidden md:flex gap-8 text-gray-700">
          <li><a href="#inicio" className="hover:text-black transition">Inicio</a></li>
          <li><a href="#rooms" className="hover:text-black transition">Habitaciones</a></li>
          <li><a href="#servicios" className="hover:text-black transition">Servicios</a></li>
          <li><a href="#actividades" className="hover:text-black transition">¿Por qué elegirnos?</a></li>
          <li><a href="#contact" className="hover:text-black transition">Contacto</a></li>
        </ul>

        {currentGuest ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate("portal")}
              className={`${ui.coralButton} px-5 py-2`}
            >
              Mi reserva
            </button>
            <button type="button" onClick={onLogout} className="hidden md:block text-sm text-gray-600 hover:text-black">
              Salir
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate("login")}
            className={`${ui.coralButton} px-5 py-2`}
          >
            Reservar
          </button>
        )}
      </div>
    </nav>
  );
}

function HomePage({ currentGuest, onNavigate, onLogout }) {
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

function AuthPage({ mode, form, status, isSubmitting, onChange, onSubmit, onNavigate }) {
  const isLogin = mode === "login";

  return (
    <main className={ui.page}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button type="button" onClick={() => onNavigate("inicio")} className="flex items-center gap-3 mb-8">
          <span className="w-14 h-14 rounded-full bg-green-700 flex items-center justify-center shadow-sm">
            <img src="/logo.svg" alt="Hotel La Ceiba" width="54" height="54" />
          </span>
          <span className="text-xl font-bold">Hotel La Ceiba</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8 items-stretch">
          <section className="relative overflow-hidden rounded-lg min-h-[520px] flex items-end">
            <img src="/calkini.jpg" alt="Calkiní, Campeche" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/45" />
            <div className="relative z-10 p-8 md:p-10 text-white">
              <p className="text-sm uppercase tracking-wide font-bold text-white/80 mb-3">
                Sistema de reservas
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-5">
                {isLogin ? "Accede a tu cuenta" : "Crea tu cuenta de huésped"}
              </h1>
              <p className="text-lg text-white/90 max-w-xl">
                Elige habitación, consulta tus reservaciones y aparta tu estancia en Hotel La Ceiba.
              </p>
            </div>
          </section>

          <form onSubmit={onSubmit} className={`${ui.card} p-6 md:p-8 self-center`}>
            <h2 className="text-2xl font-semibold mb-6">{isLogin ? "Iniciar sesión" : "Registro"}</h2>

            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TextField label="Nombre" name="firstName" value={form.firstName} onChange={onChange} required />
                <TextField label="Apellido" name="lastName" value={form.lastName} onChange={onChange} required />
              </div>
            )}

            <div className="mt-5 space-y-5">
              <TextField
                label="Correo"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
              />
              {!isLogin && (
                <TextField label="Teléfono" name="phone" value={form.phone} onChange={onChange} required />
              )}
              <TextField
                label="Contraseña"
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                required
              />
              {!isLogin && (
                <TextField
                  label="Confirmar contraseña"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={onChange}
                  required
                />
              )}
            </div>

            <StatusMessage status={status} />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-6 w-full ${ui.primaryButton}`}
            >
              {isSubmitting ? "Procesando..." : isLogin ? "Entrar" : "Crear cuenta"}
            </button>

            <div className="mt-6 text-center text-sm text-gray-600">
              {isLogin ? "¿Aún no tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
              <button
                type="button"
                onClick={() => onNavigate(isLogin ? "registro" : "login")}
                className="font-semibold text-green-700 hover:text-green-900"
              >
                {isLogin ? "Crear cuenta" : "Iniciar sesión"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function PortalPage({
  guest,
  rooms,
  selectedRoom,
  bookingForm,
  nights,
  totalPrice,
  roomAvailability,
  selectedRoomRemaining,
  reservations,
  status,
  isLoading,
  isSubmitting,
  onChange,
  onSelectRoom,
  onSubmit,
  onCancel,
  onLogout,
  onNavigate,
}) {
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
              {guest.firstName} {guest.lastName}
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

        <StatusMessage status={status} />

        {isLoading ? (
          <div className={`${ui.card} p-8`}>Cargando habitaciones...</div>
        ) : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              {rooms.map((room) => {
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
                    <img src={room.imageUrl || "/room.jpg"} alt={room.name} className="w-full h-48 object-cover" />
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
                        onClick={() => onSelectRoom(room._id)}
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
              <form onSubmit={onSubmit} className={`${ui.card} p-6 md:p-8`}>
                <h2 className="text-2xl font-semibold mb-6">Datos de estancia</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <TextField
                    label="Llegada"
                    name="checkInDate"
                    type="date"
                    value={bookingForm.checkInDate}
                    onChange={onChange}
                    required
                  />
                  <TextField
                    label="Salida"
                    name="checkOutDate"
                    type="date"
                    value={bookingForm.checkOutDate}
                    onChange={onChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`mt-6 w-full md:w-auto ${ui.primaryButton}`}
                >
                  {isSubmitting ? "Guardando..." : "Reservar habitación"}
                </button>
              </form>

              <aside className={`${ui.card} p-6`}>
                <p className={ui.eyebrow}>Resumen</p>
                <h3 className="text-2xl font-semibold mt-2">{selectedRoom?.name || "Habitación"}</h3>
                <div className="mt-5 space-y-3 text-gray-700">
	                  <SummaryRow label="Noches" value={nights} />
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
              <h2 className="text-2xl font-semibold mb-6">Mis reservaciones</h2>
              {reservations.length === 0 ? (
                <p className="text-gray-600">Todavía no tienes reservaciones registradas.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reservations.map((reservation) => (
                    <article key={reservation._id} className="border border-gray-200 rounded-lg p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">{reservation.room?.name || "Habitación"}</h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(reservation.checkInDate)} - {formatDate(reservation.checkOutDate)}
                          </p>
                        </div>
                        <span className="text-xs bg-green-50 text-green-800 px-2 py-1 rounded-full">
                          {reservation.status}
                        </span>
                      </div>
                      <p className="mt-4 font-bold">${reservation.totalPrice} MXN</p>
                      {reservation.status !== "Cancelada" && (
                        <button
                          type="button"
                          onClick={() => onCancel(reservation._id)}
                          disabled={isSubmitting}
                          className="mt-4 text-sm font-semibold text-red-700 hover:text-red-900"
                        >
                          Cancelar reservación
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function TextField({ label, name, value, onChange, type = "text", required = false }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <input
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onInput={onChange}
        className={ui.input}
      />
    </label>
  );
}

function StatusMessage({ status }) {
  if (!status.message) return null;

  return (
    <div
      className={`mt-6 rounded-md px-4 py-3 text-sm ${
        status.type === "success"
          ? "bg-green-50 text-green-800 border border-green-200"
          : "bg-red-50 text-red-800 border border-red-200"
      }`}
    >
      {status.message}
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AmenitiesSection() {
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

function WhyChooseUsSection() {
  return (
    <section id="actividades" className="bg-[#f9f9f9] py-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h3 className="text-3xl font-semibold mb-6 text-center">¿Por qué elegirnos?</h3>
        <p className="text-sm md:text-base text-gray-700 max-w-2xl mx-auto mb-10">
          Hospedándote con nosotros no solo aseguras un gran descanso, sino también diversión.
          ¡Disfruta de acceso preferencial y completamente gratis para pasar el día en <strong>Baaxal-Ha</strong>, un increíble parque acuático a solo unos minutos del hotel!
        </p>
        <div id="baaxal-ha" className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
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

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/529997481294"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-2xl hover:bg-green-600 transition"
    >
      <img src="/whatsapp.svg" alt="WhatsApp" className="w-12 h-12" />
    </a>
  );
}

function Footer() {
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
