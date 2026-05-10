import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { requestAdminJson } from "../../services/api";
import { ui } from "../../styles/tokens";
import StatusBadge from "../StatusBadge";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await requestAdminJson("/api/reservations");
      setReservations(data);
    } catch (error) {
      toast.error(error.message || "No se pudieron cargar las reservas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, nextStatus) => {
    setUpdatingId(id);
    try {
      await requestAdminJson(`/api/reservations/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: nextStatus }),
      });
      toast.success(`Reserva marcada como ${nextStatus}`);
      load();
    } catch (error) {
      toast.error(error.message || "No se pudo actualizar la reserva");
    } finally {
      setUpdatingId(null);
    }
  };

  const removeReservation = async (id) => {
    if (!window.confirm("¿Eliminar esta reserva?")) return;
    setUpdatingId(id);
    try {
      await requestAdminJson(`/api/reservations/${id}`, { method: "DELETE" });
      toast.success("Reserva eliminada");
      load();
    } catch (error) {
      toast.error(error.message || "No se pudo eliminar la reserva");
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return <div className={`${ui.card} p-8`}>Cargando reservas...</div>;
  }

  if (reservations.length === 0) {
    return (
      <div className={`${ui.card} p-8 text-gray-600`}>
        Aún no hay reservas registradas.
      </div>
    );
  }

  return (
    <div className={`${ui.card} overflow-x-auto`}>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
          <tr>
            <th className="text-left px-4 py-3">Huésped</th>
            <th className="text-left px-4 py-3">Habitación</th>
            <th className="text-left px-4 py-3">Llegada</th>
            <th className="text-left px-4 py-3">Salida</th>
            <th className="text-left px-4 py-3">Personas</th>
            <th className="text-left px-4 py-3">Total</th>
            <th className="text-left px-4 py-3">Estado</th>
            <th className="text-left px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => {
            const guestName = reservation.guest
              ? `${reservation.guest.firstName || ""} ${reservation.guest.lastName || ""}`.trim() ||
                reservation.guest.email
              : "—";
            const roomName = reservation.room?.name || "—";
            const isUpdating = updatingId === reservation._id;

            return (
              <tr key={reservation._id} className="border-t border-gray-200">
                <td className="px-4 py-3">{guestName}</td>
                <td className="px-4 py-3">{roomName}</td>
                <td className="px-4 py-3">{formatDate(reservation.checkInDate)}</td>
                <td className="px-4 py-3">{formatDate(reservation.checkOutDate)}</td>
                <td className="px-4 py-3">{reservation.numberOfGuests}</td>
                <td className="px-4 py-3">{formatMoney(reservation.totalPrice)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={reservation.status} />
                </td>
                <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                  {reservation.status !== "Confirmada" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => updateStatus(reservation._id, "Confirmada")}
                      className="text-xs font-semibold text-green-700 hover:text-green-900 disabled:text-gray-400"
                    >
                      Confirmar
                    </button>
                  )}
                  {reservation.status !== "Cancelada" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => updateStatus(reservation._id, "Cancelada")}
                      className="text-xs font-semibold text-yellow-700 hover:text-yellow-900 disabled:text-gray-400"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => removeReservation(reservation._id)}
                    className="text-xs font-semibold text-red-700 hover:text-red-900 disabled:text-gray-400"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
