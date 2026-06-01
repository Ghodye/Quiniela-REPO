import { useState, useCallback } from "react";
import { apiCall } from "@/lib/api";
import { MATCHES } from "@/lib/matches";
import type { PronosticoPayload, SaveResponse } from "@/types";

export function usePronos(correo: string, token?: string) {
  const [scores, setScores] = useState<Record<number, { home: string; away: string }>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const updateScore = useCallback(
    (matchId: number, side: "home" | "away", value: string) => {
      const num = value === "" ? "" : Math.max(0, parseInt(value)).toString();
      setScores((prev) => ({
        ...prev,
        [matchId]: { ...prev[matchId], [side]: num },
      }));
    },
    []
  );

  const savePronos = useCallback(async () => {
    const payload: PronosticoPayload[] = MATCHES.map((m) => {
      const s = scores[m.id];
      return {
        partido_id: m.id,
        goles_home: s?.home === "" || s?.home === undefined ? 0 : parseInt(s.home),
        goles_away: s?.away === "" || s?.away === undefined ? 0 : parseInt(s.away),
      };
    });

    setSaving(true);
    setMessage("");
    try {
      const res = (await apiCall({
        action: "guardar_pronos",
        correo,
        token,
        pronosticos: payload,
      })) as SaveResponse;
      setMessage(res.message || "Pronósticos guardados ✓");
    } catch {
      setMessage("Error al guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }, [correo, token, scores]);

  return { scores, saving, message, updateScore, savePronos };
}
