import { useEffect, useState } from "react";
import { ui } from "../styles/tokens";
import StarRating from "./StarRating";
import { requestJson } from "../services/api";
import { formatDate } from "../utils/dates";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await requestJson("/api/reviews");
        if (!cancelled) setReviews(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "No se pudieron cargar las reseñas.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const average =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <section id="resenas" className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <p className={`${ui.eyebrow} mb-3 text-center`}>Lo que dicen nuestros huéspedes</p>
        <h2 className="text-3xl font-semibold text-center mb-3">Reseñas</h2>
        {average && (
          <div className="flex items-center justify-center gap-3 mb-10">
            <StarRating value={Math.round(Number(average))} size="lg" />
            <span className="text-2xl font-bold text-gray-900">{average}</span>
            <span className="text-gray-500">/ 5 — {reviews.length} reseña{reviews.length !== 1 ? "s" : ""}</span>
          </div>
        )}

        {isLoading && (
          <div className={`${ui.card} p-8 text-center text-gray-600`}>Cargando reseñas...</div>
        )}

        {!isLoading && error && (
          <div className="rounded-md px-4 py-3 text-sm bg-red-50 text-red-800 border border-red-200">
            {error}
          </div>
        )}

        {!isLoading && !error && reviews.length === 0 && (
          <div className={`${ui.card} p-8 text-center text-gray-600`}>
            Todavía no hay reseñas aprobadas. ¡Sé el primero después de tu estancia!
          </div>
        )}

        {!isLoading && !error && reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => {
              const guestName = review.guest
                ? `${review.guest.firstName || ""} ${review.guest.lastName || ""}`.trim() || "Huésped"
                : "Huésped";
              return (
                <article key={review._id} className={`${ui.card} p-6 flex flex-col`}>
                  <StarRating value={review.rating} size="sm" />
                  <p className="mt-4 text-gray-700 italic flex-1">"{review.comment}"</p>
                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">{guestName}</span>
                    <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
