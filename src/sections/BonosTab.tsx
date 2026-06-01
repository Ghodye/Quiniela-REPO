import { Star, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BonosData } from "@/types";

interface BonosTabProps {
  bonos: BonosData;
  saving: boolean;
  message: string;
  updateBono: (field: keyof BonosData, value: string) => void;
  saveBonos: () => void;
}

export function BonosTab({
  bonos,
  saving,
  message,
  updateBono,
  saveBonos,
}: BonosTabProps) {
  const fields: {
    key: keyof BonosData;
    label: string;
    color: string;
    borderColor: string;
    placeholder: string;
  }[] = [
    {
      key: "goleador",
      label: "MÁXIMO GOLEADOR (+5 pts)",
      color: "text-cyan-400",
      borderColor: "border-cyan-800/40",
      placeholder: "Ej. Kylian Mbappé",
    },
    {
      key: "portero",
      label: "MEJOR PORTERO (+5 pts)",
      color: "text-cyan-400",
      borderColor: "border-cyan-800/40",
      placeholder: "Ej. Thibaut Courtois",
    },
    {
      key: "favorito",
      label: "EQUIPO FAVORITO (+2 pts)",
      color: "text-emerald-400",
      borderColor: "border-emerald-800/40",
      placeholder: "Ej. Brasil",
    },
    {
      key: "revelacion",
      label: "EQUIPO REVELACIÓN (+6 pts)",
      color: "text-amber-400",
      borderColor: "border-amber-800/40",
      placeholder: "Ej. Ecuador",
    },
  ];

  return (
    <div className="card-match p-5 rounded-2xl border border-gray-800 space-y-4">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Star className="w-5 h-5 text-amber-400" />
        Premios y Bonos Extra
      </h2>

      <div className="space-y-3">
        {fields.map((f) => (
          <div key={f.key}>
            <label
              className={`block text-xs font-mono ${f.color} mb-1.5 font-bold tracking-wider`}
            >
              {f.label}
            </label>
            <Input
              type="text"
              value={bonos[f.key]}
              onChange={(e) => updateBono(f.key, e.target.value)}
              placeholder={f.placeholder}
              className={`bg-[#0d1117] ${f.borderColor} rounded-lg h-10 text-white text-sm placeholder:text-gray-600 focus:border-cyan-400 focus:ring-cyan-400/20`}
            />
          </div>
        ))}
      </div>

      {message && (
        <p className="text-xs text-center text-cyan-400 font-mono">{message}</p>
      )}

      <Button
        onClick={saveBonos}
        disabled={saving}
        className="w-full h-11 bg-cyan-500 hover:bg-cyan-400 text-[#0d1117] font-bold rounded-xl text-sm mt-2"
      >
        <Save className="w-4 h-4 mr-2" />
        {saving ? "GUARDANDO..." : "GUARDAR BONOS"}
      </Button>
    </div>
  );
}
