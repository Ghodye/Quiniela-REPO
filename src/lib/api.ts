// === REEMPLAZA ESTA URL CON TU ENLACE DE GOOGLE APPS SCRIPT ===
export const API_URL = "https://script.google.com/macros/s/AKfycby0lxii1F6sdDImTQHP5nqBP5sM4fRkb6FmhpT3Aiv15nFUjeDG2rER-DKIfd7dxYHQ/exec";

export async function apiCall(body: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(API_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  });
  return res.json();
}
