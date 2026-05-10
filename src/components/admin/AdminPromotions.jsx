import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { requestAdminJson } from "../../services/api";
import { ui } from "../../styles/tokens";

const emptyForm = {
  title: "",
  description: "",
  imageUrl: "/promo.jpg",
  discount: 0,
  validUntil: "",
  isActive: true,
};

const formatDate = (value) => {
  if (!value) return "Sin caducidad";
  return new Date(value).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const toInputDate = (value) => {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
};

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await requestAdminJson("/api/promotions?all=true");
      setPromotions(data);
    } catch (error) {
      toast.error(error.message || "No se pudieron cargar las promociones");
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

  const startEdit = (promo) => {
    setEditingId(promo._id);
    setForm({
      title: promo.title || "",
      description: promo.description || "",
      imageUrl: promo.imageUrl || "/promo.jpg",
      discount: promo.discount ?? 0,
      validUntil: toInputDate(promo.validUntil),
      isActive: promo.isActive ?? true,
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
        discount: Number(form.discount),
        validUntil: form.validUntil || null,
      };
      if (editingId) {
        await requestAdminJson(`/api/promotions/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Promoción actualizada");
      } else {
        await requestAdminJson("/api/promotions", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Promoción creada");
      }
      resetForm();
      load();
    } catch (error) {
      toast.error(error.message || "No se pudo guardar");
    } finally {
      setIsSaving(false);
    }
  };

  const removePromo = async (id) => {
    if (!window.confirm("¿Eliminar esta promoción?")) return;
    try {
      await requestAdminJson(`/api/promotions/${id}`, { method: "DELETE" });
      toast.success("Promoción eliminada");
      if (editingId === id) resetForm();
      load();
    } catch (error) {
      toast.error(error.message || "No se pudo eliminar");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form onSubmit={handleSubmit} className={`${ui.card} p-6 lg:col-span-1 space-y-4`}>
        <p className={ui.eyebrow}>{editingId ? "Editar promoción" : "Nueva promoción"}</p>
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Título</span>
          <input
            required
            name="title"
            value={form.title}
            onChange={handleChange}
            className={ui.input}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Descripción</span>
          <textarea
            required
            name="description"
            rows="3"
            value={form.description}
            onChange={handleChange}
            className={ui.input}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">URL de imagen</span>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className={ui.input}
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Descuento (%)</span>
            <input
              name="discount"
              type="number"
              min="0"
              max="100"
              value={form.discount}
              onChange={handleChange}
              className={ui.input}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Vigente hasta</span>
            <input
              name="validUntil"
              type="date"
              value={form.validUntil}
              onChange={handleChange}
              className={ui.input}
            />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className="w-4 h-4 accent-green-700"
          />
          Activa
        </label>
        <div className="flex gap-2">
          <button type="submit" disabled={isSaving} className={`flex-1 ${ui.primaryButton}`}>
            {isSaving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear promoción"}
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
          <div className={`${ui.card} p-6`}>Cargando promociones...</div>
        ) : promotions.length === 0 ? (
          <div className={`${ui.card} p-6 text-gray-600`}>
            No hay promociones registradas.
          </div>
        ) : (
          promotions.map((promo) => (
            <article key={promo._id} className={`${ui.card} p-5 flex flex-col md:flex-row gap-4`}>
              <img
                src={promo.imageUrl || "/promo.jpg"}
                alt={promo.title}
                className="w-full md:w-40 h-32 object-cover rounded-md"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">{promo.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{promo.description}</p>
                  </div>
                  {promo.discount > 0 && (
                    <span className="text-sm font-semibold text-[#F08A6B]">
                      -{promo.discount}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Vigente hasta: {formatDate(promo.validUntil)}
                </p>
                <p className="text-sm text-gray-600">
                  {promo.isActive ? "Activa" : "Inactiva"}
                </p>
                <div className="flex gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => startEdit(promo)}
                    className="text-xs font-semibold text-green-700 hover:text-green-900"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => removePromo(promo._id)}
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
