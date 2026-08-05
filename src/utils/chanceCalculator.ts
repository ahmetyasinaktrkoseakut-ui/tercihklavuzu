import { UniversityProgram, ChanceCategory } from "../types/program";

export interface ProgramChanceResult {
  category: ChanceCategory;
  badgeLabel: string;
  badgeColor: string; // Tailwind CSS sınıfları
  badgeBorder: string;
  badgeBg: string;
  ratio?: number;
  description: string;
}

/**
 * Kullanıcı Sıralamasına (S) Göre Mantıksal İhtimal Hesaplama Motoru:
 * 1. Gelme İhtimali Olan (Rekabet Bölgesi): [0.80 * S, 1.20 * S] (Örn: 100k için 80.000 - 120.000)
 * 2. Kesin Olan (Garanti Bölgesi): > 1.20 * S (Örn: 100k için 120.000, 200.000, 250.000 ve üstü TÜM güvenli bölümler)
 * 3. Zor İhtimal (Sürpriz / Hayal): < 0.80 * S (Örn: 100k için 80.000'den daha yüksek/zor olanlar)
 * 4. Yeni Açılanlar / Dolmayanlar: rank2025 === null veya 0
 */
export function calculateChance(
  rank2025: number | null | undefined,
  userRank: number | null | undefined
): ProgramChanceResult {
  // 1. Yeni Açılan / Dolmayan Kontrolü
  if (rank2025 === null || rank2025 === undefined || rank2025 === 0) {
    return {
      category: "YENI_DOLMAYAN",
      badgeLabel: "Yeni Açıldı / Dolmadı",
      badgeColor: "text-blue-400",
      badgeBg: "bg-blue-500/10 dark:bg-blue-950/40",
      badgeBorder: "border-blue-500/30",
      description: "2025 yılında kontenjanı dolmadı veya programa yeni öğrenci alınacak.",
    };
  }

  // 2. Sıralama Girilmemişse
  if (!userRank || userRank <= 0) {
    return {
      category: "TUMU",
      badgeLabel: "Sıralama Giriniz",
      badgeColor: "text-slate-400",
      badgeBg: "bg-slate-500/10 dark:bg-slate-800/40",
      badgeBorder: "border-slate-500/30",
      description: "Hesaplama yapabilmek için ilgili puan türünde sıralama giriniz.",
    };
  }

  const ratio = rank2025 / userRank;

  // 3. Gelme İhtimali Olan (Rekabet Bölgesi) [0.80 * S, 1.20 * S]
  if (ratio >= 0.80 && ratio <= 1.20) {
    return {
      category: "GELME_IHTIMALI",
      badgeLabel: "Gelme İhtimali Var (Rekabet)",
      badgeColor: "text-amber-400 dark:text-amber-300",
      badgeBg: "bg-amber-500/15 dark:bg-amber-950/40",
      badgeBorder: "border-amber-500/40",
      ratio,
      description: `[0.80 - 1.20]x aralığında. Gerçek rekabet bölgesinde yer almaktadır.`,
    };
  }

  // 4. Kesin Olan (Garanti Bölgesi) > 1.20 * S (120.000, 200.000, 250.000 ve yukarısı tüm güvenli tercihler)
  if (ratio > 1.20) {
    return {
      category: "KESIN_GARANTI",
      badgeLabel: "Kesin / Garanti",
      badgeColor: "text-emerald-400 dark:text-emerald-300",
      badgeBg: "bg-emerald-500/15 dark:bg-emerald-950/40",
      badgeBorder: "border-emerald-500/40",
      ratio,
      description: `> 1.20x aralığında. Kendi sıralamanızdan belirgin derecede düşük (güvenli/açıkta bırakmayacak) tercih.`,
    };
  }

  // 5. Zor İhtimal (Sürpriz / Hayal Bölgesi) < 0.80 * S
  return {
    category: "ZOR_SURPRIZ",
    badgeLabel: "Zor İhtimal (Sürpriz)",
    badgeColor: "text-rose-400 dark:text-rose-300",
    badgeBg: "bg-rose-500/15 dark:bg-rose-950/40",
    badgeBorder: "border-rose-500/40",
    ratio,
    description: `< 0.80x aralığında. Başarı sıralamanızın üstünde, sürpriz/hayal tercihi.`,
  };
}
