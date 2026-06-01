import { useState, useCallback } from "react";
import { apiCall } from "@/lib/api";
import type { BonosData, SaveResponse } from "@/types";

export function useBonos(correo: string, token?: string) {
  const [bonos, setBonos] = useState<BonosData>({
    goleador: "",
    portero: "",
    favorito: "",
    revelacion: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const updateBono = useCallback((field: keyof BonosData, value: string) => {
    setBonos((prev) => ({ ...prev, [field]: value }));
  }, []);

  const saveBonos = useCallback(async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = (await apiCall({
        action: "guardar_bonos",
        correo,
        token,
        ...bonos,
      })) as SaveResponse;
      setMessage(res.message || "Bonos guardados ✓");
    } catch {
      setMessage("Error al guardar bonos");
    } finally {
      setSaving(false);
    }
  }, [correo, token, bonos]);

  return { bonos, saving, message, updateBono, saveBonos };
}
