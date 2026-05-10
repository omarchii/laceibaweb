export default function StarRating({ value = 0, size = "md", interactive = false, onChange }) {
  const sizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`flex gap-1 ${sizes[size] || sizes.md}`} role={interactive ? "radiogroup" : "img"} aria-label={`Calificación ${value} de 5`}>
      {stars.map((star) => {
        const isFilled = star <= value;
        const className = `leading-none ${isFilled ? "text-[#F08A6B]" : "text-gray-300"} ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`;

        if (interactive) {
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange?.(star)}
              className={className}
              aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
            >
              ★
            </button>
          );
        }

        return (
          <span key={star} className={className} aria-hidden="true">
            ★
          </span>
        );
      })}
    </div>
  );
}
