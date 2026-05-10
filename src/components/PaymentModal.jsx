import { useState } from "react";
import { ui } from "../styles/tokens";
import TextField from "./TextField";

const emptyCard = {
  cardNumber: "",
  cardName: "",
  expiry: "",
  cvv: "",
};

export default function PaymentModal({ reservation, onClose, onConfirm, isProcessing }) {
  const [card, setCard] = useState(emptyCard);
  const [error, setError] = useState("");

  if (!reservation) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCard((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const digits = card.cardNumber.replace(/\s+/g, "");
    if (!/^\d{16}$/.test(digits)) {
      setError("El número de tarjeta debe tener 16 dígitos.");
      return;
    }
    if (card.cardName.trim().length < 3) {
      setError("Captura el nombre del titular.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
      setError("La vigencia debe tener formato MM/AA.");
      return;
    }
    if (!/^\d{3,4}$/.test(card.cvv)) {
      setError("CVV inválido.");
      return;
    }

    onConfirm(reservation);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className={`${ui.card} w-full max-w-md p-6 md:p-7`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className={ui.eyebrow}>Pago seguro</p>
            <h3 className="text-xl font-semibold mt-1">Confirmar reservación</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm text-gray-700 mb-5">
          <div className="flex justify-between">
            <span>{reservation.room?.name || "Habitación"}</span>
            <strong>${reservation.totalPrice} MXN</strong>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Folio: {reservation._id.slice(-8).toUpperCase()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Número de tarjeta"
            name="cardNumber"
            value={card.cardNumber}
            onChange={handleChange}
            required
          />
          <TextField
            label="Nombre del titular"
            name="cardName"
            value={card.cardName}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Vigencia (MM/AA)"
              name="expiry"
              value={card.expiry}
              onChange={handleChange}
              required
            />
            <TextField
              label="CVV"
              name="cvv"
              type="password"
              value={card.cvv}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full ${ui.primaryButton}`}
          >
            {isProcessing ? "Procesando..." : `Pagar $${reservation.totalPrice} MXN`}
          </button>
          <p className="text-xs text-gray-500 text-center">
            Esta es una pasarela simulada para fines académicos. No se realiza ningún cargo real.
          </p>
        </form>
      </div>
    </div>
  );
}
