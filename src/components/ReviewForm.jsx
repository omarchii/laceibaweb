import { useState } from "react";
import toast from "react-hot-toast";
import { ui } from "../styles/tokens";
import StarRating from "./StarRating";
import { requestJson } from "../services/api";

export default function ReviewForm({ canReview }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (rating < 1 || rating > 5) {
      toast.error("Selecciona una calificación entre 1 y 5 estrellas.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Escribe tu comentario antes de enviar.");
      return;
    }

    setIsSubmitting(true);
    try {
      await requestJson("/api/reviews", {
        method: "POST",
        body: JSON.stringify({ rating, comment: comment.trim() }),
      });
      toast.success("¡Gracias por tu reseña! Será visible una vez aprobada.");
      setComment("");
      setRating(5);
      setSubmitted(true);
    } catch (error) {
      toast.error(error.message || "No se pudo enviar la reseña.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canReview) {
    return (
      <section className={`${ui.card} p-6 md:p-8 mt-10`}>
        <h2 className="text-2xl font-semibold mb-3">Comparte tu experiencia</h2>
        <p className="text-gray-600">
          Una vez que tengas una reservación registrada, podrás dejarnos una reseña aquí mismo.
        </p>
      </section>
    );
  }

  if (submitted) {
    return (
      <section className={`${ui.card} p-6 md:p-8 mt-10`}>
        <h2 className="text-2xl font-semibold mb-3">¡Reseña enviada!</h2>
        <p className="text-gray-600">
          Gracias por compartir tu experiencia. Tu reseña aparecerá en el sitio una vez que el equipo
          la apruebe.
        </p>
      </section>
    );
  }

  return (
    <section className={`${ui.card} p-6 md:p-8 mt-10`}>
      <h2 className="text-2xl font-semibold mb-2">Comparte tu experiencia</h2>
      <p className="text-gray-600 mb-6">
        Tu opinión nos ayuda a mejorar y a otros huéspedes a elegir Hotel La Ceiba.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <span className="block text-sm font-semibold text-gray-700 mb-2">Calificación</span>
          <StarRating value={rating} size="lg" interactive onChange={setRating} />
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Tu comentario</span>
          <textarea
            required
            rows={4}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            className={ui.input}
            placeholder="Cuéntanos qué te gustó de tu estancia..."
          />
        </label>

        <button type="submit" disabled={isSubmitting} className={`mt-6 w-full md:w-auto ${ui.primaryButton}`}>
          {isSubmitting ? "Enviando..." : "Enviar reseña"}
        </button>
      </form>
    </section>
  );
}
