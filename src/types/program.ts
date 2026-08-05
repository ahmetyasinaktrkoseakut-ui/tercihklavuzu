export type ScoreType = "SAY" | "EA" | "SOZ" | "DIL" | "TYT";

export interface UniversityProgram {
  id: string;
  universityName: string;
  faculty: string;
  department: string;
  city: string;
  scoreType: ScoreType;
  quota: number;
  rank2025: number | null; // null veya 0 ise "Yeni Açıldı / Dolmadı"
  score2025: number | null;
  specialConditions?: string; // Koşul maddeleri
}

export type ChanceCategory =
  | "TUMU"
  | "GELME_IHTIMALI"  // [0.80 * S, 1.20 * S] - Rekabet Bölgesi
  | "KESIN_GARANTI"   // > 1.20 * S - Garanti Bölgesi
  | "ZOR_SURPRIZ"    // < 0.80 * S - Sürpriz / Hayal Bölgesi
  | "YENI_DOLMAYAN"; // rank2025 === null || rank2025 === 0

export interface UserRanks {
  SAY?: number | null;
  EA?: number | null;
  SOZ?: number | null;
  DIL?: number | null;
  TYT?: number | null;
}

export interface UserScores {
  SAY?: number | null;
  EA?: number | null;
  SOZ?: number | null;
  DIL?: number | null;
  TYT?: number | null;
}

export interface FilterState {
  scoreType: ScoreType | "ALL";
  chanceCategory: ChanceCategory;
  selectedCity: string;
  searchQuery: string;
  targetDepartment: string;
  onlyNewOrEmpty: boolean;
}
