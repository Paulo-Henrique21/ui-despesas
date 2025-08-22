export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper para criar URLs da API
export const createApiUrl = (endpoint: string) => {
  // Remove barra inicial se existir para evitar duplicação
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};
