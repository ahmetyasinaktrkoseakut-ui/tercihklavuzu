"use client";

import React, { useState, useEffect } from "react";
import { ScoreType, ActiveScoreType, UserRanks, UserScores } from "../types/program";
import { Award, Hash, Zap, CheckCircle2, RotateCcw, Layers, Monitor, Trash2 } from "lucide-react";

interface UserRankInputProps {
  ranks: UserRanks;
  scores: UserScores;
  activeScoreType: ActiveScoreType;
  educationMode: "ORGUN" | "AOF";
  onRankChange: (type: ScoreType, value: number | null) => void;
  onScoreChange: (type: ScoreType, value: number | null) => void;
  onScoreTypeSelect: (type: ActiveScoreType) => void;
  onResetToDefaults?: () => void;
}

const ORGUN_SCORE_TYPES: { type: ScoreType; label: string; color: string; bg: string }[] = [
  { type: "SAY", label: "Sayısal (Örgün)", color: "text-cyan-400", bg: "from-cyan-500/20 to-blue-500/20" },
  { type: "EA", label: "Eşit Ağırlık (Örgün)", color: "text-amber-400", bg: "from-amber-500/20 to-orange-500/20" },
  { type: "SOZ", label: "Sözel (Örgün)", color: "text-purple-400", bg: "from-purple-500/20 to-pink-500/20" },
  { type: "DIL", label: "Dil (Örgün)", color: "text-emerald-400", bg: "from-emerald-500/20 to-teal-500/20" },
  { type: "TYT", label: "TYT Ön Lisans (Örgün)", color: "text-blue-400", bg: "from-blue-500/20 to-indigo-500/20" },
];

export const UserRankInput: React.FC<UserRankInputProps> = ({
  ranks,
  scores,
  activeScoreType,
  educationMode,
  onRankChange,
  onScoreChange,
  onScoreTypeSelect,
  onResetToDefaults,
}) => {
  function fmtRank(val: number | null | undefined): string {
    if (val === null || val === undefined) return "";
    return val.toLocaleString("tr-TR");
  }

  function fmtScore(val: number | null | undefined): string {
    if (val === null || val === undefined) return "";
    return val.toString().replace(".", ",");
  }

  // Local string states initialized with exact rank numbers or empty string
  const [rankTexts, setRankTexts] = useState<Record<ScoreType, string>>({
    SAY: fmtRank(ranks.SAY),
    EA: fmtRank(ranks.EA),
    SOZ: fmtRank(ranks.SOZ),
    DIL: fmtRank(ranks.DIL),
    TYT: fmtRank(ranks.TYT),
    AOF: fmtRank(ranks.AOF),
  });

  const [scoreTexts, setScoreTexts] = useState<Record<ScoreType, string>>({
    SAY: fmtScore(scores.SAY),
    EA: fmtScore(scores.EA),
    SOZ: fmtScore(scores.SOZ),
    DIL: fmtScore(scores.DIL),
    TYT: fmtScore(scores.TYT),
    AOF: fmtScore(scores.AOF),
  });

  // Synchronize when ranks/scores props update, respecting null/empty
  useEffect(() => {
    setRankTexts({
      SAY: fmtRank(ranks.SAY),
      EA: fmtRank(ranks.EA),
      SOZ: fmtRank(ranks.SOZ),
      DIL: fmtRank(ranks.DIL),
      TYT: fmtRank(ranks.TYT),
      AOF: fmtRank(ranks.AOF),
    });

    setScoreTexts({
      SAY: fmtScore(scores.SAY),
      EA: fmtScore(scores.EA),
      SOZ: fmtScore(scores.SOZ),
      DIL: fmtScore(scores.DIL),
      TYT: fmtScore(scores.TYT),
      AOF: fmtScore(scores.AOF),
    });
  }, [ranks.SAY, ranks.EA, ranks.SOZ, ranks.DIL, ranks.TYT, ranks.AOF, scores.SAY, scores.EA, scores.SOZ, scores.DIL, scores.TYT, scores.AOF]);

  const handleRankInput = (st: ScoreType, rawVal: string) => {
    setRankTexts((prev) => ({ ...prev, [st]: rawVal }));

    const sanitized = rawVal.replace(/[\.\,\s]/g, "");
    if (!sanitized) {
      onRankChange(st, null);
      return;
    }

    const num = parseInt(sanitized, 10);
    if (!isNaN(num) && num > 0) {
      onRankChange(st, num);
    } else {
      onRankChange(st, null);
    }
  };

  const handleScoreInput = (st: ScoreType, rawVal: string) => {
    setScoreTexts((prev) => ({ ...prev, [st]: rawVal }));

    const sanitized = rawVal.replace(",", ".").trim();
    if (!sanitized) {
      onScoreChange(st, null);
      return;
    }

    const num = parseFloat(sanitized);
    if (!isNaN(num) && num > 0) {
      onScoreChange(st, num);
    } else {
      onScoreChange(st, null);
    }
  };

  const handleClearAOF = () => {
    onRankChange("AOF", null);
    onScoreChange("AOF", null);
    setRankTexts((prev) => ({ ...prev, AOF: "" }));
    setScoreTexts((prev) => ({ ...prev, AOF: "" }));
  };

  const hasAnyRank = ranks.SAY || ranks.EA || ranks.SOZ || ranks.DIL || ranks.TYT || ranks.AOF;

  if (educationMode === "AOF") {
    // AOF Mode Layout: Single TYT rank input for Açıköğretim with clean clear capability
    return (
      <div className="bg-slate-900/90 border border-pink-500/30 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Monitor className="w-5 h-5 text-pink-400" />
              Açıköğretim (AÖF) Sınav Sıralamanız ve Puanınız
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Açıköğretim ve Uzaktan Eğitim programları TYT başarı sıranıza göre değerlendirilir.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(ranks.AOF || scores.AOF) && (
              <button
                onClick={handleClearAOF}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-700/50 rounded-xl transition-all"
                title="AÖF Sıralamasını ve Puanını Temizle"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                AÖF Verilerini Temizle
              </button>
            )}

            {hasAnyRank && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                AÖF Modu Aktif
              </span>
            )}
          </div>
        </div>

        {/* Single TYT Rank Card for AOF */}
        <div className="max-w-md bg-slate-950/80 border border-pink-500/40 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-pink-400" />
              TYT Başarı Sıralaması (Açıköğretim)
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-pink-400" />
                TYT Sıralamanız *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Örn: 802.058"
                  value={rankTexts.AOF}
                  onChange={(e) => handleRankInput("AOF", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 rounded-lg px-3 py-2 text-sm font-bold text-white placeholder-slate-600 outline-none transition-all pr-8"
                />
                {rankTexts.AOF && (
                  <button
                    onClick={() => handleRankInput("AOF", "")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-bold"
                    title="Temizle"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-pink-400" />
                TYT Puanınız (Opsiyonel)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Örn: 303,70941"
                  value={scoreTexts.AOF}
                  onChange={(e) => handleScoreInput("AOF", e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 focus:border-pink-500 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all pr-8"
                />
                {scoreTexts.AOF && (
                  <button
                    onClick={() => handleScoreInput("AOF", "")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-bold"
                    title="Temizle"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ORGUN Mode Layout: 5 Örgün Cards (SAY, EA, SOZ, DIL, TYT)
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              Örgün Üniversite Sınav Sıralamanız ve Puanlarınız
            </h2>

            {hasAnyRank && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Cihaza Otomatik Kaydedildi
              </span>
            )}
          </div>
        </div>

        {/* Score Type Tabs for ORGUN */}
        <div className="flex items-center gap-2 flex-wrap">
          {onResetToDefaults && (
            <button
              onClick={onResetToDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/50 rounded-xl transition-all"
              title="Resmi Sınav Sonuç Belgesi Değerlerine Sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
              Sınav Sonuçlarıma Dön
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex-wrap">
            {/* TÜMÜ (Örgün) Tab */}
            <button
              onClick={() => onScoreTypeSelect("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeScoreType === "ALL"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              TÜM ÖRGÜN
            </button>

            {ORGUN_SCORE_TYPES.map((st) => (
              <button
                key={st.type}
                onClick={() => onScoreTypeSelect(st.type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeScoreType === st.type
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {st.type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Inputs for 5 Örgün Score Types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {ORGUN_SCORE_TYPES.map((st) => {
          const isSelected = activeScoreType === st.type;

          return (
            <div
              key={st.type}
              onClick={() => onScoreTypeSelect(st.type)}
              className={`relative cursor-pointer rounded-xl p-3.5 transition-all border ${
                isSelected
                  ? "bg-slate-800/90 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50"
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${st.color}`}>
                  {st.label}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                )}
              </div>

              {/* Rank Input */}
              <div className="mb-2.5">
                <label className="block text-[10px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-slate-500" />
                  2026 Sıralaması *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Örn: 722.465"
                    value={rankTexts[st.type]}
                    onChange={(e) => handleRankInput(st.type, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white placeholder-slate-600 outline-none transition-all pr-6"
                  />
                  {rankTexts[st.type] && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRankInput(st.type, "");
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-bold"
                      title="Temizle"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Score Input (Optional) */}
              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Award className="w-3 h-3 text-slate-500" />
                  Puan (Opsiyonel)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Örn: 225,18384"
                    value={scoreTexts[st.type]}
                    onChange={(e) => handleScoreInput(st.type, e.target.value)}
                    className="w-full bg-slate-900/70 border border-slate-800 focus:border-slate-600 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 placeholder-slate-600 outline-none transition-all pr-6"
                  />
                  {scoreTexts[st.type] && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScoreInput(st.type, "");
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-bold"
                      title="Temizle"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
