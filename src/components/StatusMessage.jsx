export default function StatusMessage({ status }) {
  if (!status?.message) return null;

  return (
    <div
      className={`mt-6 rounded-md px-4 py-3 text-sm ${
        status.type === "success"
          ? "bg-green-50 text-green-800 border border-green-200"
          : "bg-red-50 text-red-800 border border-red-200"
      }`}
    >
      {status.message}
    </div>
  );
}
