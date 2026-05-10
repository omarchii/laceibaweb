import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { requestAdminJson } from "../../services/api";
import { ui } from "../../styles/tokens";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminMessages() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await requestAdminJson("/api/contact");
      setContacts(data);
    } catch (error) {
      toast.error(error.message || "No se pudieron cargar los mensajes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const removeMessage = async (id) => {
    if (!window.confirm("¿Eliminar este mensaje?")) return;
    try {
      await requestAdminJson(`/api/contact/${id}`, { method: "DELETE" });
      toast.success("Mensaje eliminado");
      load();
    } catch (error) {
      toast.error(error.message || "No se pudo eliminar");
    }
  };

  if (isLoading) {
    return <div className={`${ui.card} p-8`}>Cargando mensajes...</div>;
  }

  if (contacts.length === 0) {
    return (
      <div className={`${ui.card} p-8 text-gray-600`}>
        Aún no hay mensajes de contacto.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <article key={contact._id} className={`${ui.card} p-5`}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold">{contact.name}</h3>
              <p className="text-sm text-gray-600">
                <a href={`mailto:${contact.email}`} className="hover:text-green-700">
                  {contact.email}
                </a>
                {contact.phone && <> · {contact.phone}</>}
              </p>
            </div>
            <span className="text-xs text-gray-500">{formatDate(contact.createdAt)}</span>
          </div>
          <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap">{contact.message}</p>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => removeMessage(contact._id)}
              className="text-xs font-semibold text-red-700 hover:text-red-900"
            >
              Eliminar
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
