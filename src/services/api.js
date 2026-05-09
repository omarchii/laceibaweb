const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const TOKEN_KEY = "laceibaToken";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const requestJson = async (path, options = {}) => {
  const token = getToken();
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

export { API_URL };
