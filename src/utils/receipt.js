import { jsPDF } from "jspdf";
import { formatDate, getNights } from "./dates";

export const generateReceipt = (reservation, guest) => {
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  const folio = reservation._id.slice(-8).toUpperCase();
  const nights = getNights(
    reservation.checkInDate.slice(0, 10),
    reservation.checkOutDate.slice(0, 10)
  );

  doc.setFillColor(21, 128, 61);
  doc.rect(0, 0, 612, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Hotel La Ceiba", 40, 50);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Comprobante de reservación", 40, 70);

  doc.setTextColor(23, 23, 23);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(`Folio: ${folio}`, 40, 130);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Estado: ${reservation.status}`, 40, 150);
  doc.text(`Fecha de emisión: ${formatDate(new Date())}`, 40, 168);

  let y = 210;
  const line = (label, value) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 40, y);
    doc.setFont("helvetica", "normal");
    doc.text(String(value), 220, y);
    y += 22;
  };

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Datos del huésped", 40, y - 20);
  doc.setFontSize(11);
  line("Nombre:", `${guest.firstName} ${guest.lastName}`);
  line("Correo:", guest.email);
  line("Teléfono:", guest.phone);

  y += 14;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Detalle de la estancia", 40, y);
  doc.setFontSize(11);
  y += 24;
  line("Habitación:", reservation.room?.name || "—");
  line("Tipo:", reservation.room?.type || "—");
  line("Llegada:", formatDate(reservation.checkInDate));
  line("Salida:", formatDate(reservation.checkOutDate));
  line("Noches:", nights);
  line("Huéspedes:", reservation.numberOfGuests || 1);
  line("Precio por noche:", `$${reservation.room?.pricePerNight || 0} MXN`);

  y += 14;
  doc.setDrawColor(229, 231, 235);
  doc.line(40, y, 572, y);
  y += 26;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Total pagado", 40, y);
  doc.setTextColor(21, 128, 61);
  doc.text(`$${reservation.totalPrice} MXN`, 470, y, { align: "right" });

  doc.setTextColor(107, 114, 128);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Gracias por hospedarse en Hotel La Ceiba — Calkiní, Campeche.",
    40,
    750
  );
  doc.text(
    "Este comprobante es de uso académico y no constituye factura fiscal.",
    40,
    764
  );

  doc.save(`reservacion-${folio}.pdf`);
};
