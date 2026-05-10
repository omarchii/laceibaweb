import { useState } from "react";
import toast from "react-hot-toast";
import { ui } from "../styles/tokens";
import TextField from "../components/TextField";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function AuthPage({ mode, auth, onNavigate }) {
  const isLogin = mode === "login";
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLogin) {
      if (form.password.length < 6) {
        toast.error("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        toast.error("Las contraseñas no coinciden.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        await auth.login({
          email: form.email.trim(),
          password: form.password,
        });
        toast.success("¡Bienvenido de vuelta!");
      } else {
        await auth.register({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
        });
        toast.success("Cuenta creada exitosamente.");
      }
      setForm(emptyForm);
      onNavigate("portal");
    } catch (error) {
      toast.error(error.message || (isLogin ? "No se pudo iniciar sesión." : "No se pudo crear la cuenta."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={ui.page}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button type="button" onClick={() => onNavigate("inicio")} className="flex items-center gap-3 mb-8">
          <span className="w-14 h-14 rounded-full bg-green-700 flex items-center justify-center shadow-sm">
            <img src="/logo.svg" alt="Hotel La Ceiba" width="54" height="54" />
          </span>
          <span className="text-xl font-bold">Hotel La Ceiba</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8 items-stretch">
          <section className="relative overflow-hidden rounded-lg min-h-[520px] flex items-end">
            <img src="/calkini.jpg" alt="Calkiní, Campeche" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/45" />
            <div className="relative z-10 p-8 md:p-10 text-white">
              <p className="text-sm uppercase tracking-wide font-bold text-white/80 mb-3">
                Sistema de reservas
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-5">
                {isLogin ? "Accede a tu cuenta" : "Crea tu cuenta de huésped"}
              </h1>
              <p className="text-lg text-white/90 max-w-xl">
                Elige habitación, consulta tus reservaciones y aparta tu estancia en Hotel La Ceiba.
              </p>
            </div>
          </section>

          <form onSubmit={handleSubmit} className={`${ui.card} p-6 md:p-8 self-center`}>
            <h2 className="text-2xl font-semibold mb-6">{isLogin ? "Iniciar sesión" : "Registro"}</h2>

            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TextField label="Nombre" name="firstName" value={form.firstName} onChange={handleChange} required />
                <TextField label="Apellido" name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
            )}

            <div className="mt-5 space-y-5">
              <TextField label="Correo" name="email" type="email" value={form.email} onChange={handleChange} required />
              {!isLogin && (
                <TextField label="Teléfono" name="phone" value={form.phone} onChange={handleChange} required />
              )}
              <TextField label="Contraseña" name="password" type="password" value={form.password} onChange={handleChange} required />
              {!isLogin && (
                <TextField label="Confirmar contraseña" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className={`mt-6 w-full ${ui.primaryButton}`}>
              {isSubmitting ? "Procesando..." : isLogin ? "Entrar" : "Crear cuenta"}
            </button>

            <div className="mt-6 text-center text-sm text-gray-600">
              {isLogin ? "¿Aún no tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
              <button
                type="button"
                onClick={() => onNavigate(isLogin ? "registro" : "login")}
                className="font-semibold text-green-700 hover:text-green-900"
              >
                {isLogin ? "Crear cuenta" : "Iniciar sesión"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
