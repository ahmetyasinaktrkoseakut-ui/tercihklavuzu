"use client";

import React, { useState } from "react";
import { UniversityProgram } from "../types/program";
import { calculateChance, ProgramChanceResult } from "../utils/chanceCalculator";
import { Heart, Info, MapPin, Building2, ChevronLeft, ChevronRight, Check } from "lucide-react";

interface ProgramTableProps {
  programs: UniversityProgram[];
  userRank: number | null;
  favoritedIds: Set<string>;
  onToggleFavorite: (program: UniversityProgram) => void;
  onOpenConditionsModal: (conditions: string, programName: string) => void;
}

const ITEMS_PER_PAGE = 50;

export const ProgramTable: React.FC<ProgramTableProps> = ({
  programs,
  userRank,
  favoritedIds,
  onToggleFavorite,
  onOpenConditionsModal,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(programs.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pagePrograms = programs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handle page change
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (programs.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center my-6">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
          🔍
        </div>
        <h3 className="text-base font-bold text-slate-200">Sonuç Bulunamadı veya Veri Henüz Yüklenmedi</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          Arama veya filtre kriterlerinizi değiştirin. Eğer veri henüz sisteme yüklenmediyse sağ üstteki &quot;Veri Yükle / PDF Entegre&quot; butonunu kullanabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Info & Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 px-4 py-3 rounded-xl">
        <span className="text-xs text-slate-300">
          Toplam <strong>{programs.length.toLocaleString("tr-TR")}</strong> sonuçtan{" "}
          <strong>{startIndex + 1}</strong> - <strong>{Math.min(startIndex + ITEMS_PER_PAGE, programs.length)}</strong> arası gösteriliyor.
        </span>

        {/* Pagination Buttons */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-all text-xs flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs text-slate-300 font-semibold px-3 py-1 bg-slate-950 rounded-md border border-slate-800">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-all text-xs flex items-center gap-1"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-semibold">
              <th className="py-3.5 px-4 w-12 text-center">İşlem</th>
              <th className="py-3.5 px-4 min-w-[200px]">İhtimal Durumu</th>
              <th className="py-3.5 px-4 min-w-[220px]">Üniversite & Şehir</th>
              <th className="py-3.5 px-4 min-w-[220px]">Fakülte & Bölüm</th>
              <th className="py-3.5 px-4 w-24 text-center">Tür</th>
              <th className="py-3.5 px-4 w-28 text-right">2025 Sırası</th>
              <th className="py-3.5 px-4 w-24 text-right">Kontenjan</th>
              <th className="py-3.5 px-4 w-20 text-center">Koşul</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {pagePrograms.map((prog) => {
              const chance: ProgramChanceResult = calculateChance(prog.rank2025, userRank);
              const isFav = favoritedIds.has(prog.id);

              return (
                <tr
                  key={prog.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Favorite Button */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onToggleFavorite(prog)}
                      className={`p-2 rounded-lg transition-all ${
                        isFav
                          ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                          : "text-slate-500 hover:text-pink-400 hover:bg-slate-800"
                      }`}
                      title={isFav ? "Listeden Çıkar" : "Tercih Listeme Ekle"}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? "fill-pink-500 text-pink-500" : ""}`} />
                    </button>
                  </td>

                  {/* Chance Badge */}
                  <td className="py-3 px-4">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${chance.badgeBg} ${chance.badgeColor} ${chance.badgeBorder}`}
                      title={chance.description}
                    >
                      <span>{chance.badgeLabel}</span>
                    </div>
                  </td>

                  {/* University & City */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-100">{prog.universityName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {prog.city}
                    </div>
                  </td>

                  {/* Faculty & Department */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-indigo-300">{prog.department}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-slate-500" />
                      {prog.faculty}
                    </div>
                  </td>

                  {/* Score Type */}
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {prog.scoreType}
                    </span>
                  </td>

                  {/* 2025 Rank */}
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-200">
                    {prog.rank2025 ? (
                      prog.rank2025.toLocaleString("tr-TR")
                    ) : (
                      <span className="text-blue-400 text-[11px]">Dolmadı/Yeni</span>
                    )}
                  </td>

                  {/* Quota */}
                  <td className="py-3 px-4 text-right font-mono text-slate-400">
                    {prog.quota || "-"}
                  </td>

                  {/* Special Conditions */}
                  <td className="py-3 px-4 text-center">
                    {prog.specialConditions ? (
                      <button
                        onClick={() => onOpenConditionsModal(prog.specialConditions!, prog.department)}
                        className="p-1.5 rounded-lg bg-indigo-950/60 text-indigo-400 hover:bg-indigo-900/60 border border-indigo-700/50 transition-all"
                        title="Özel Koşul Maddeleri"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="lg:hidden space-y-3">
        {pagePrograms.map((prog) => {
          const chance: ProgramChanceResult = calculateChance(prog.rank2025, userRank);
          const isFav = favoritedIds.has(prog.id);

          return (
            <div
              key={prog.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-semibold ${chance.badgeBg} ${chance.badgeColor} ${chance.badgeBorder}`}
                  >
                    {chance.badgeLabel}
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm">{prog.universityName}</h4>
                  <p className="text-xs text-indigo-300 font-semibold">{prog.department}</p>
                </div>

                <button
                  onClick={() => onToggleFavorite(prog)}
                  className={`p-2 rounded-lg transition-all ${
                    isFav
                      ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                      : "text-slate-500 bg-slate-800 hover:text-pink-400"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? "fill-pink-500 text-pink-500" : ""}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <div>
                  <span className="block text-[10px] text-slate-500">Şehir / Fakülte</span>
                  <span className="font-medium text-slate-200">{prog.city} / {prog.faculty}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500">Puan Türü</span>
                  <span className="font-bold text-indigo-400">{prog.scoreType}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500">2025 Sıralaması</span>
                  <span className="font-mono font-bold text-slate-200">
                    {prog.rank2025 ? prog.rank2025.toLocaleString("tr-TR") : "Yeni / Dolmadı"}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500">Kontenjan</span>
                  <span className="font-mono text-slate-300">{prog.quota || "-"}</span>
                </div>
              </div>

              {prog.specialConditions && (
                <button
                  onClick={() => onOpenConditionsModal(prog.specialConditions!, prog.department)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-indigo-400 bg-indigo-950/40 border border-indigo-800/50 rounded-lg hover:bg-indigo-900/40"
                >
                  <Info className="w-3.5 h-3.5" />
                  Özel Koşulları Görüntüle
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 px-4 py-3 rounded-xl">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition-all text-xs font-semibold flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Önceki Sayfa
          </button>

          <span className="text-xs text-slate-300 font-semibold">
            Sayfa {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition-all text-xs font-semibold flex items-center gap-1"
          >
            Sonraki Sayfa <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
