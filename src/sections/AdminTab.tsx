import { ShieldAlert, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { apiCall } from "@/lib/api";
import type { SaveResponse } from "@/types";

interface AdminTabProps {
  correo: string;
  token?: string;
  onResultSubmitted: () => void;
}

export function AdminTab({ correo, token, onResultSubmitted }: AdminTabProps) {
  const [matchId, setMatchId] = useState("");
  const [homeGoals, setHomeGoals] = useState("");
  const [awayGoals, setAwayGoals] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async () => {
    if (!matchId || homeGoals === "" || awayGoals === "") {
      setMessage("Completa todos los campos");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = (await apiCall({
        action: "cargar_resultado_real",
        correo,
        token,
        partido_id: parseInt(matchId),
        goles_home_real: parseInt(homeGoals),
        goles_away_real: parseInt(awayGoals),
      })) as SaveResponse;
      setMessage(res.message || "Resultado publicado");
      if (res.success) {
        setMatchId("");
        setHomeGoals("");
        setAwayGoals("");
        onResultSubmitted();
      }
    } catch {
      setMessage("Error al publicar resultado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-red-400 font-mono flex items-center gap-2">
        <ShieldAlert className="w-5 h-5" />
        Panel Admin
      </h2>

      <div className="bg-[#161b22] p-4 rounded-xl border border-red-950 space-y-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1 font-mono">
            ID PARTIDO
          </label>
          <Input
            type="number"
            placeholder="Ej. 1"
            value={matchId}
            onChange={(e) => setMatchId(e.target.value)}
            className="bg-[#0d1117] border-gray-700 rounded-lg h-10 text-white text-sm focus:border-red-400 focus:ring-red-400/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-400 mb-1 font-mono">
              GOLES LOCAL
            </label>
            <Input
              type="number"
              min={0}
              placeholder="0"
              value={homeGoals}
              onChange={(e) => setHomeGoals(e.target.value)}
              className="bg-[#0d1117] border-gray-700 rounded-lg h-10 text-center text-white text-sm focus:border-red-400 focus:ring-red-400/20"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1 font-mono">
              GOLES VISITA
            </label>
            <Input
              type="number"
              min={0}
              placeholder="0"
              value={awayGoals}
              onChange={(e) => setAwayGoals(e.target.value)}
              className="bg-[#0d1117] border-gray-700 rounded-lg h-10 text-center text-white text-sm focus:border-red-400 focus:ring-red-400/20"
            />
          </div>
        </div>

        {message && (
          <p className="text-xs text-center font-mono text-red-400">{message}</p>
        )}

        <Button
          onClick={submit}
          disabled={loading}
          className="w-full h-11 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs"
        >
          <Send className="w-4 h-4 mr-2" />
          {loading ? "PUBLICANDO..." : "PUBLICAR RESULTADO"}
        </Button>
      </div>
    </div>
  );
}
