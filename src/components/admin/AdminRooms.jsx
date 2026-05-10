import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { requestAdminJson } from "../../services/api";
import { ui } from "../../styles/tokens";

const ROOM_TYPES = ["Sencilla", "Doble", "Suite"];

const emptyForm = {
  name: "",
  type: "Sencilla",
  pricePerNight: "",
  stock: 1,
  capacity: 1,
  imageUrl: "/room.jpg",
  isAvailable: true,
};

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await requestAdminJson("/api/rooms");
      setRooms(data);
    } catch (error) {
      toast.error(error.message || "No se pudieron cargar las habitaciones");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const startEdit = (room) => {
    setEditingId(room._id);
    setForm({
      name: room.name || "",
      type: room.type || "Sencilla",
      pricePerNight: room.pricePerNight ?? "",
      stock: room.stock ?? 1,
      capacity: room.capacity ?? 1,
      imageUrl: room.imageUrl || "/room.jpg",
      isAvailable: room.isAvailable ?? true,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...form,
        pricePerNight: Number(form.pricePerNight),
        stock: Number(form.stock),
        capacity: Number(form.capacity),
      };
      if (editingId) {
        await requestAdminJson(`/api/rooms/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Habitación actualizada");
      } else {
        await requestAdminJson("/api/rooms", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Habitación creada");
      }
      resetForm();
      load();
    } catch (error) {
      toast.error(error.message || "No se pudo guardar");
    } finally {
      setIsSaving(false);
    }
  };

  const removeRoom = async (id) => {
    if (!window.confirm("¿Eliminar esta habitación?")) return;
    try {
      await requestAdminJson(`/api/rooms/${id}`, { method: "DELETE" });
      toast.success("Habitación eliminada");
      if (editingId === id) resetForm();
      load();
    } catch (error) {
      toast.error(error.message || "No se pudo eliminar");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form onSubmit={handleSubmit} className={`${ui.card} p-6 lg:col-span-1 space-y-4`}>
        <p className={ui.eyebrow}>{editingId ? "Editar habitación" : "Nueva habitación"}</p>
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Nombre</span>
          <input
            required
            name="name"
            value={form.name}
            onChange={handleChange}
            className={ui.input}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Tipo</span>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className={ui.input}
          >
            {ROOM_TYPES.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Precio por noche (MXN)</span>
          <input
            required
            name="pricePerNight"
            type="number"
            min="0"
            value={form.pricePerNight}
            onChange={handleChange}
            className={ui.input}
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Stock</span>
            <input
              required
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              className={ui.input}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Capacidad</span>
            <input
              required
              name="capacity"
              type="number"
              min="1"
              value={form.capacity}
              onChange={handleChange}
              className={ui.input}
            />
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">URL de imagen</span>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className={ui.input}
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleChange}
            className="w-4 h-4 accent-green-700"
          />
          Disponible para reserva
        </label>
        <div className="flex gap-2">
          <button type="submit" disabled={isSaving} className={`flex-1 ${ui.primaryButton}`}>
            {isSaving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear habitación"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-3 text-sm text-gray-600 hover:text-black"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="lg:col-span-2 space-y-4">
        {isLoading ? (
          <div className={`${ui.card} p-6`}>Cargando habitaciones...</div>
        ) : rooms.length === 0 ? (
          <div className={`${ui.card} p-6 text-gray-600`}>
            No hay habitaciones registradas.
          </div>
        ) : (
          rooms.map((room) => (
            <article key={room._id} className={`${ui.card} p-5 flex flex-col md:flex-row gap-4`}>
              <img
                src={room.imageUrl || "/room.jpg"}
                alt={room.name}
                className="w-full md:w-40 h-32 object-cover rounded-md"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={ui.eyebrow}>{room.type}</p>
                    <h3 className="text-lg font-semibold">{room.name}</h3>
                  </div>
                  <span className="text-sm font-semibold text-green-700">
                    {formatMoney(room.pricePerNight)}/noche
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Stock: {room.stock} · Capacidad: {room.capacity} personas
                </p>
                <p className="text-sm text-gray-600">
                  {room.isAvailable ? "Disponible" : "No disponible"}
                </p>
                <div className="flex gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => startEdit(room)}
                    className="text-xs font-semibold text-green-700 hover:text-green-900"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRoom(room._id)}
                    className="text-xs font-semibold text-red-700 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
