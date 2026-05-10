import { useState } from "react";
import toast from "react-hot-toast";
import { ui } from "../styles/tokens";
import TextField from "./TextField";
import { requestJson } from "../services/api";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await requestJson("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
        }),
      });
      toast.success("¡Mensaje enviado! Te responderemos pronto.");
      setForm(emptyForm);
    } catch (error) {
      toast.error(error.message || "No se pudo enviar el mensaje.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <p className={`${ui.eyebrow} mb-3 text-center`}>Contáctanos</p>
        <h2 className="text-3xl font-semibold text-center mb-3">
          ¿Tienes alguna duda o petición especial?
        </h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Escríbenos y te responderemos lo antes posible. También puedes llamarnos o
          mandarnos un WhatsApp directo.
        </p>

        <form onSubmit={handleSubmit} className={`${ui.card} p-6 md:p-8`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextField label="Nombre" name="name" value={form.name} onChange={handleChange} required />
            <TextField label="Correo" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="mt-5">
            <TextField label="Teléfono (opcional)" name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <label className="block mt-5">
            <span className="text-sm font-semibold text-gray-700">Mensaje</span>
            <textarea
              required
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              className={ui.input}
              placeholder="Cuéntanos cómo podemos ayudarte..."
            />
          </label>

          <button type="submit" disabled={isSubmitting} className={`mt-6 w-full md:w-auto ${ui.primaryButton}`}>
            {isSubmitting ? "Enviando..." : "Enviar mensaje"}
          </button>
        </form>
      </div>
    </section>
  );
}
