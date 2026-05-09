import { ui } from "../styles/tokens";

export default function TextField({ label, name, value, onChange, type = "text", required = false }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <input
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onInput={onChange}
        className={ui.input}
      />
    </label>
  );
}
