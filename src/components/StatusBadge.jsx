const STYLES = {
  Pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Confirmada: "bg-green-100 text-green-800 border-green-200",
  Cancelada: "bg-red-100 text-red-800 border-red-200",
};

export default function StatusBadge({ status }) {
  const className = STYLES[status] || "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${className}`}>
      {status}
    </span>
  );
}
