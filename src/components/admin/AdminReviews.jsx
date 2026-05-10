import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { requestAdminJson } from "../../services/api";
import { ui } from "../../styles/tokens";
import StarRating from "../StarRating";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await requestAdminJson("/api/reviews?all=true");
      setReviews(data);
    } catch (error) {
      toast.error(error.message || "No se pudieron cargar las reseñas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleApproval = async (review) => {
    setUpdatingId(review._id);
    try {
      await requestAdminJson(`/api/reviews/${review._id}`, {
        method: "PUT",
        body: JSON.stringify({ isApproved: !review.isApproved }),
      });
      toast.success(review.isApproved ? "Reseña ocultada" : "Reseña aprobada");
      load();
    } catch (error) {
      toast.error(error.message || "No se pudo actualizar la reseña");
    } finally {
      setUpdatingId(null);
    }
  };

  const removeReview = async (id) => {
    if (!window.confirm("¿Eliminar esta reseña?")) return;
    setUpdatingId(id);
    try {
      await requestAdminJson(`/api/reviews/${id}`, { method: "DELETE" });
      toast.success("Reseña eliminada");
      load();
    } catch (error) {
      toast.error(error.message || "No se pudo eliminar");
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return <div className={`${ui.card} p-8`}>Cargando reseñas...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className={`${ui.card} p-8 text-gray-600`}>
        Aún no hay reseñas registradas.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const guestName = review.guest
          ? `${review.guest.firstName || ""} ${review.guest.lastName || ""}`.trim() ||
            "Huésped"
          : "Huésped";
        const isUpdating = updatingId === review._id;

        return (
          <article key={review._id} className={`${ui.card} p-5`}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{guestName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating value={review.rating} size="sm" />
                  <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                  review.isApproved
                    ? "bg-green-50 text-green-800 border-green-200"
                    : "bg-yellow-50 text-yellow-800 border-yellow-200"
                }`}
              >
                {review.isApproved ? "Aprobada" : "Pendiente"}
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap">{review.comment}</p>
            <div className="flex gap-3 mt-3">
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => toggleApproval(review)}
                className="text-xs font-semibold text-green-700 hover:text-green-900 disabled:text-gray-400"
              >
                {review.isApproved ? "Ocultar" : "Aprobar"}
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => removeReview(review._id)}
                className="text-xs font-semibold text-red-700 hover:text-red-900 disabled:text-gray-400"
              >
                Eliminar
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
