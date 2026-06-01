import { Trophy, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MATCHES } from "@/lib/matches";
import { getFlag } from "@/lib/flags";

interface PronosticosTabProps {
  scores: Record<number, { home: string; away: string }>;
  saving: boolean;
  message: string;
  updateScore: (matchId: number, side: "home" | "away", value: string) => void;
  savePronos: () => void;
}

export function PronosticosTab({
  scores,
  saving,
  message,
  updateScore,
  savePronos,
}: PronosticosTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-cyan-400" />
          Tus Predicciones
        </h2>
        <span className="text-xs bg-green-950 border border-green-500 text-green-400 px-2.5 py-1 rounded-md font-mono font-bold tracking-wider">
          ABIERTAS
        </span>
      </div>

      <div className="space-y-2">
        {MATCHES.map((m) => {
          const flagHome = getFlag(m.home);
          const flagAway = getFlag(m.away);
          const sc = scores[m.id] || { home: "", away: "" };

          return (
            <div
              key={m.id}
              className="card-match rounded-xl border border-gray-800 overflow-hidden"
            >
              {/* Header with match number */}
              <div className="bg-[#0d1117]/50 px-3 py-1 flex justify-between items-center">
                <span className="text-[10px] font-mono text-gray-500 font-bold">
                  #{String(m.id).padStart(2, "0")}
                </span>
              </div>

              {/* Match body - 3 column grid */}
              <div className="px-2 py-3 grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                {/* Home team - right aligned */}
                <div className="flex items-center justify-end gap-2 min-w-0">
                  <span className="text-xs text-white font-semibold truncate text-right uppercase leading-tight">
                    {m.home}
                  </span>
                  <span className="text-base leading-none select-none shrink-0">
                    {flagHome}
                  </span>
                </div>

                {/* Center inputs */}
                <div className="flex items-center gap-1 shrink-0">
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={sc.home}
                    onChange={(e) =>
                      updateScore(m.id, "home", e.target.value)
                    }
                    className="w-9 h-9 bg-[#0d1117] border border-gray-700 rounded-lg text-center text-white text-sm font-bold focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  />
                  <span className="text-gray-600 text-xs font-bold">-</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={sc.away}
                    onChange={(e) =>
                      updateScore(m.id, "away", e.target.value)
                    }
                    className="w-9 h-9 bg-[#0d1117] border border-gray-700 rounded-lg text-center text-white text-sm font-bold focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  />
                </div>

                {/* Away team - left aligned */}
                <div className="flex items-center justify-start gap-2 min-w-0">
                  <span className="text-base leading-none select-none shrink-0">
                    {flagAway}
                  </span>
                  <span className="text-xs text-white font-semibold truncate text-left uppercase leading-tight">
                    {m.away}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {message && (
        <p className="text-xs text-center text-cyan-400 font-mono">{message}</p>
      )}

      <Button
        onClick={savePronos}
        disabled={saving}
        className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-[#0d1117] font-extrabold rounded-xl text-sm shadow-lg tracking-wider"
      >
        <Save className="w-4 h-4 mr-2" />
        {saving ? "GUARDANDO..." : "GUARDAR MIS MARCADORES"}
      </Button>
    </div>
  );
}
