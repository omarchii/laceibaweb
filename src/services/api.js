const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const TOKEN_KEY = "laceibaToken";
const ADMIN_TOKEN_KEY = "laceibaAdminToken";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);
export const setAdminToken = (token) => localStorage.setItem(ADMIN_TOKEN_KEY, token);
export const clearAdminToken = () => localStorage.removeItem(ADMIN_TOKEN_KEY);

const fetchJson = async (path, options, token) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(
      "No se pudo conectar con el backend. Verifica que esté corriendo en http://localhost:5001."
    );
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Ocurrió un error");
  return data;
};

export const requestJson = (path, options = {}) =>
  fetchJson(path, options, getToken());

export const requestAdminJson = (path, options = {}) =>
  fetchJson(path, options, getAdminToken());

export const uploadFile = async (path, file, fieldName = "document") => {
  const token = getToken();
  const formData = new FormData();
  formData.append(fieldName, file);

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers,
      body: formData,
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el backend. Verifica que esté corriendo en http://localhost:5001."
    );
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "No se pudo subir el archivo");
  return data;
};

export { API_URL };
