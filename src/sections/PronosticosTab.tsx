import { Trophy, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MATCHES } from "@/lib/matches";

interface PronosticosTabProps {
  scores: Record<number, { home: string; away: string }>;
  saving: boolean;
  message: string;
  updateScore: (matchId: number, side: "home" | "away", value: string) => void;
  savePronos: () => void;
}

// Función para convertir nombres de países o códigos de 2 letras en emojis de banderas reales
function getEmojiFlag(teamString: string) {
  if (!teamString) return "🏳️";
  
  const nameUpper = teamString.trim().toUpperCase();

  // Diccionario manual por si los países vienen con el nombre limpio en matches.ts
  const countryToCode: Record<string, string> = {
    "MEXICO": "MX",
    "SUDAFRICA": "ZA",
    "COREA DEL SUR": "KR",
    "REPUBLICA CHECA": "CZ",
    "BOSNIA Y HERZEGOVINA": "BA",
    "EGIPTO": "EG",
    "ESTADOS UNIDOS": "US",
    "PARAGUAY": "PY",
    "SUIZA": "CH",
    "QATAR": "QA",
    "BRASIL": "BR",
    "MARRUECOS": "MA",
    "HAITI": "HT",
    "ESCOCIA": "GB",
    "AUSTRALIA": "AU",
    "TURQUIA": "TR",
    "ALEMANIA": "DE",
    "ARGENTINA": "AR",
    "FRANCIA": "FR",
    "ESPAÑA": "ES",
    "ITALIA": "IT",
    "INGLATERRA": "GB",
    "PORTUGAL": "PT",
    "PAISES BAJOS": "NL",
    "URUGUAY": "UY",
    "COLOMBIA": "CO",
    "CHILE": "CL",
    "PERU": "PE",
    "ECUADOR": "EC",
    "VENEZUELA": "VE",
    "JAPON": "JP",
    "REPUBLICA DE IRLANDA": "IE",
    "IRLANDA DEL NORTE": "GB",
    "GALES": "GB"
  };

  // 1. Intentamos buscar si el nombre completo coincide con nuestro diccionario
  let code = countryToCode[nameUpper];

  // 2. Si no coincide, extraemos las últimas dos letras por si viene como "MEXICO MX"
  if (!code) {
    const words = nameUpper.split(" ");
    const lastWord = words[words.length - 1];
    if (lastWord.length === 2 && /^[A-Z]{2}$/.test(lastWord)) {
      code = lastWord;
    }
  }

  // 3. Si no encontramos ningún código válido de 2 letras, ponemos una bandera blanca genérica
  if (!code) return "🏳️";

  // Conversión matemática a caracteres regionales de emoji de bandera
  const codePoints = code
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
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
          // Generamos los emojis de las banderas procesando los nombres de los equipos
          const flagHome = getEmojiFlag(m.home);
          const flagAway = getEmojiFlag(m.away);
          const sc = scores[m.id] || { home: "", away: "" };

          return (
            <div
              key={m.id}
              className="card-match rounded-xl border border-gray-800 overflow-hidden"
            >
              {/* Header con el número del partido */}
              <div className="bg-[#0d1117]/50 px-3 py-1 flex justify-between items-center">
                <span className="text-[10px] font-mono text-gray-500 font-bold">
                  #{String(m.id).padStart(2, "0")}
                </span>
              </div>

              {/* Cuerpo del partido - Grid de 3 columnas */}
              <div className="px-2 py-3 grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                {/* Equipo Local - Alineado a la derecha */}
                <div className="flex items-center justify-end gap-2 min-w-0">
                  <span className="text-xs text-white font-semibold truncate text-right uppercase leading-tight">
                    {m.home}
                  </span>
                  <span className="text-xl leading-none select-none shrink-0 filter drop-shadow">
                    {flagHome}
                  </span>
                </div>

                {/* Inputs de los marcadores en el centro */}
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

                {/* Equipo Visitante - Alineado a la izquierda */}
                <div className="flex items-center justify-start gap-2 min-w-0">
                  <span className="text-xl leading-none select-none shrink-0 filter drop-shadow">
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