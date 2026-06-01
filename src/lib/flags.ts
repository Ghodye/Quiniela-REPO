export const FLAGS: Record<string, string> = {
  MEXICO: "🇲🇽",
  SUDAFRICA: "🇿🇦",
  "COREA DEL SUR": "🇰🇷",
  "REPUBLICA CHECA": "🇨🇿",
  "BOSNIA Y HERZEGOVINA": "🇧🇦",
  EGIPTO: "🇪🇬",
  "ESTADOS UNIDOS": "🇺🇸",
  PARAGUAY: "🇵🇾",
  SUIZA: "🇨🇭",
  QATAR: "🇶🇦",
  BRASIL: "🇧🇷",
  MARRUECOS: "🇲🇦",
  HAITI: "🇭🇹",
  ESCOCIA: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  AUSTRALIA: "🇦🇺",
  TURQUIA: "🇹🇷",
  ALEMANIA: "🇩🇪",
  CURAZAO: "🇨🇼",
  "PAISES BAJOS": "🇳🇱",
  JAPON: "🇯🇵",
  "COSTA DE MARFIL": "🇨🇮",
  ECUADOR: "🇪🇨",
  SUECIA: "🇸🇪",
  TUNEZ: "🇹🇳",
  CANADA: "🇨🇦",
  "ARABIA SAUDI": "🇸🇦",
  BELGICA: "🇧🇪",
  IRAN: "🇮🇷",
  FRANCIA: "🇫🇷",
  "NUEVA ZELANDA": "🇳🇿",
  IRAK: "🇮🇶",
  NORUEGA: "🇳🇴",
  ARGENTINA: "🇦🇷",
  AUSTRIA: "🇦🇹",
  JORDANIA: "🇯🇴",
  PORTUGAL: "🇵🇹",
  "RD DEL CONGO": "🇨🇩",
  INGLATERRA: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  CROACIA: "🇭🇷",
  PANAMA: "🇵🇦",
  GHANA: "🇬🇭",
  UZBEKISTAN: "🇺🇿",
  COLOMBIA: "🇨🇴",
  URUGUAY: "🇺🇾",
  SENEGAL: "🇸🇳",
  "CABO VERDE": "🇨🇻",
  ARGELIA: "🇩🇿",
  ESPANA: "🇪🇸",
  ESPAÑA: "🇪🇸",
};

export function getFlag(country: string): string {
  const normalized = country
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
  // Try direct lookup first
  if (FLAGS[normalized]) return FLAGS[normalized];
  // Try with Ñ variations
  if (FLAGS[normalized.replace(/N/g, "Ñ")]) return FLAGS[normalized.replace(/N/g, "Ñ")];
  return "🏳️";
}
