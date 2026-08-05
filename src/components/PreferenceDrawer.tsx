"use client";

import React from "react";
import { UniversityProgram } from "../types/program";
import { calculateChance, ProgramChanceResult } from "../utils/chanceCalculator";
import { Heart, ArrowUp, ArrowDown, Trash2, Printer, AlertCircle, FileText, CheckCircle } from "lucide-react";

interface PreferenceDrawerProps {
  preferences: UniversityProgram[];
  userRank: number | null;
  onRemove: (programId: string) => void;
  onReorder: (newOrder: UniversityProgram[]) => void;
  onClearAll: () => void;
}

export const PreferenceDrawer: React.FC<PreferenceDrawerProps> = ({
  preferences,
  userRank,
  onRemove,
  onReorder,
  onClearAll,
}) => {
  const moveItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= preferences.length) return;

    const updated = [...preferences];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    onReorder(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  const isOverLimit = preferences.length > 24;

  return (
    <div className="space-y-6">
      {/* Top Banner & Limits */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              YKS 2026 Tercih Listem (Favorilerim)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Eklediğiniz programları sıraya koyabilir, sürükleyebilir veya yazıcıdan/PDF olarak çıktı alabilirsiniz.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {preferences.length > 0 && (
              <>
                <button
                  onClick={onClearAll}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Listeyi Temizle
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/30 transition-all print:hidden"
                >
                  <Printer className="w-4 h-4" />
                  Listeyi Yazdır / PDF İndir
                </button>
              </>
            )}
          </div>
        </div>

        {/* YKS 24 Preference Limit Indicator */}
        <div className="mt-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              YKS Hak Kopyalama & Sınır Takibi:
            </span>
            <span className={`font-bold font-mono ${isOverLimit ? "text-rose-400" : "text-emerald-400"}`}>
              {preferences.length} / 24 Hak Kullanıldı
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isOverLimit ? "bg-rose-500" : "bg-gradient-to-r from-indigo-500 to-emerald-500"
              }`}
              style={{ width: `${Math.min((preferences.length / 24) * 100, 100)}%` }}
            />
          </div>

          {isOverLimit && (
            <div className="mt-2 text-xs text-rose-400 flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              YKS ÖSYM kurallarına göre en fazla 24 tercih yapabilirsiniz. Lütfen listenizi 24 veya altına indiriniz.
            </div>
          )}
        </div>
      </div>

      {/* Preferences List */}
      {preferences.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center">
          <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">Henüz Tercih Eklenmedi</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Genel Tercih Robotu veya Hedef Bölüm Arama sekmelerinden beğendiğiniz bölümlerin yanındaki kalp butonuna tıklayarak listenize ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {preferences.map((prog, index) => {
            const chance: ProgramChanceResult = calculateChance(prog.rank2025, userRank);

            return (
              <div
                key={prog.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg transition-all"
              >
                {/* Preference Order Number Badge */}
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-mono font-bold text-sm">
                    {index + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{prog.universityName}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {prog.scoreType}
                      </span>
                    </div>

                    <p className="text-xs text-indigo-300 font-semibold">{prog.department}</p>
                    <p className="text-[11px] text-slate-400">
                      {prog.city} - {prog.faculty}
                    </p>
                  </div>
                </div>

                {/* Info & Chance & Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {/* Rank */}
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-500">2025 Sıralaması</span>
                    <span className="font-mono font-bold text-xs text-slate-200">
                      {prog.rank2025 ? prog.rank2025.toLocaleString("tr-TR") : "Yeni / Dolmadı"}
                    </span>
                  </div>

                  {/* Chance Badge */}
                  <div
                    className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold hidden md:block ${chance.badgeBg} ${chance.badgeColor} ${chance.badgeBorder}`}
                  >
                    {chance.badgeLabel}
                  </div>

                  {/* Up / Down Reorder Controls */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => moveItem(index, "up")}
                      disabled={index === 0}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-all"
                      title="Yukarı Taşı"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveItem(index, "down")}
                      disabled={index === preferences.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-all"
                      title="Aşağı Taşı"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemove(prog.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-all"
                    title="Listeden Çıkar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
