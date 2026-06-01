export interface Match {
  id: number;
  home: string;
  away: string;
}

export interface PronosticoPayload {
  partido_id: number;
  goles_home: number;
  goles_away: number;
}

export interface User {
  correo: string;
  nombre: string;
  token?: string;
  esAdmin?: boolean | string;
}

export interface RankingEntry {
  nombre: string;
  puntos: number;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  requireToken?: boolean;
  isNew?: boolean;
  user?: User;
}

export interface SaveResponse {
  success: boolean;
  message: string;
}

export interface RankingResponse {
  ranking?: RankingEntry[];
}

export type ActiveTab = 'pronos' | 'bonos' | 'ranking' | 'admin';

export interface BonosData {
  goleador: string;
  portero: string;
  favorito: string;
  revelacion: string;
}
