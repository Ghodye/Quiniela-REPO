import { Medal, Loader2 } from "lucide-react";
import type { RankingEntry } from "@/types";

interface RankingTabProps {
  ranking: RankingEntry[];
  loading: boolean;
}

export function RankingTab({ ranking, loading }: RankingTabProps) {
  const getMedalColor = (pos: number) => {
    if (pos === 0) return "text-amber-400";
    if (pos === 1) return "text-gray-300";
    if (pos === 2) return "text-amber-700";
    return "text-gray-500";
  };

  const getRowBg = (pos: number) => {
    if (pos === 0) return "bg-amber-950/20";
    if (pos === 1) return "bg-gray-800/20";
    if (pos === 2) return "bg-orange-950/20";
    return "";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Medal className="w-5 h-5 text-amber-400" />
        Tabla de Posiciones
      </h2>

      <div className="bg-[#161b22] rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#0d1117] border-b border-gray-800">
            <tr>
              <th className="p-3 text-center w-12 text-gray-400 font-mono text-xs">
                POS
              </th>
              <th className="p-3 text-gray-400 font-mono text-xs">JUGADOR</th>
              <th className="p-3 text-center w-16 text-gray-400 font-mono text-xs">
                PTS
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && ranking.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-6 text-center">
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-400 mx-auto" />
                </td>
              </tr>
            ) : ranking.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-6 text-center text-gray-500 text-xs font-mono"
                >
                  Aún no hay resultados registrados.
                </td>
              </tr>
            ) : (
              ranking.map((u, i) => (
                <tr
                  key={`${u.nombre}-${i}`}
                  className={`border-b border-gray-800/50 last:border-0 ${getRowBg(i)}`}
                >
                  <td className="p-3 text-center">
                    {i < 3 ? (
                      <Medal
                        className={`w-5 h-5 mx-auto ${getMedalColor(i)}`}
                      />
                    ) : (
                      <span className="font-mono font-bold text-gray-500 text-sm">
                        {i + 1}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-white text-sm font-medium">
                    {u.nombre}
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-emerald-400 text-sm">
                    {u.puntos}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
