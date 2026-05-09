export default function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
