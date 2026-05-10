import { useState } from "react";
import toast from "react-hot-toast";
import { ui } from "../../styles/tokens";
import TextField from "../TextField";

export default function AdminLogin({ onLogin, onCancel }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onLogin(form);
      toast.success("Bienvenido al panel de administración");
    } catch (error) {
      toast.error(error.message || "No se pudo iniciar sesión");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={`${ui.page} flex items-center justify-center px-4 py-16`}>
      <div className={`${ui.card} w-full max-w-md p-8`}>
        <p className={`${ui.eyebrow} mb-2`}>Acceso restringido</p>
        <h1 className="text-3xl font-bold mb-2">Panel de administración</h1>
        <p className="text-sm text-gray-600 mb-6">
          Ingresa con tu cuenta de administrador para gestionar el hotel.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Correo"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${ui.primaryButton}`}
          >
            {isSubmitting ? "Verificando..." : "Entrar"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full text-sm text-gray-600 hover:text-black"
          >
            Volver al inicio
          </button>
        </form>
      </div>
    </main>
  );
}
