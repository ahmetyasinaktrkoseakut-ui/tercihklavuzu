"use client";

import React, { useState, useEffect } from "react";
import { ScoreType, UserRanks, UserScores } from "../types/program";
import { Award, Hash, Zap } from "lucide-react";

interface UserRankInputProps {
  ranks: UserRanks;
  scores: UserScores;
  activeScoreType: ScoreType;
  onRankChange: (type: ScoreType, value: number | null) => void;
  onScoreChange: (type: ScoreType, value: number | null) => void;
  onScoreTypeSelect: (type: ScoreType) => void;
}

const SCORE_TYPES: { type: ScoreType; label: string; color: string; bg: string }[] = [
  { type: "SAY", label: "Sayısal (SAY)", color: "text-cyan-400", bg: "from-cyan-500/20 to-blue-500/20" },
  { type: "EA", label: "Eşit Ağırlık (EA)", color: "text-amber-400", bg: "from-amber-500/20 to-orange-500/20" },
  { type: "SOZ", label: "Sözel (SÖZ)", color: "text-purple-400", bg: "from-purple-500/20 to-pink-500/20" },
  { type: "DIL", label: "Dil (DİL)", color: "text-emerald-400", bg: "from-emerald-500/20 to-teal-500/20" },
];

export const UserRankInput: React.FC<UserRankInputProps> = ({
  ranks,
  scores,
  activeScoreType,
  onRankChange,
  onScoreChange,
  onScoreTypeSelect,
}) => {
  // Local string states to allow dots/commas typing like "275.000"
  const [rankTexts, setRankTexts] = useState<Record<ScoreType, string>>({
    SAY: ranks.SAY ? ranks.SAY.toLocaleString("tr-TR") : "",
    EA: ranks.EA ? ranks.EA.toLocaleString("tr-TR") : "",
    SOZ: ranks.SOZ ? ranks.SOZ.toLocaleString("tr-TR") : "",
    DIL: ranks.DIL ? ranks.DIL.toLocaleString("tr-TR") : "",
  });

  const [scoreTexts, setScoreTexts] = useState<Record<ScoreType, string>>({
    SAY: scores.SAY ? strScore(scores.SAY) : "",
    EA: scores.EA ? strScore(scores.EA) : "",
    SOZ: scores.SOZ ? strScore(scores.SOZ) : "",
    DIL: scores.DIL ? strScore(scores.DIL) : "",
  });

  function strScore(val: number | null): string {
    if (!val) return "";
    return val.toString().replace(".", ",");
  }

  // Update local texts when parent props update
  useEffect(() => {
    setRankTexts({
      SAY: ranks.SAY ? ranks.SAY.toLocaleString("tr-TR") : "",
      EA: ranks.EA ? ranks.EA.toLocaleString("tr-TR") : "",
      SOZ: ranks.SOZ ? ranks.SOZ.toLocaleString("tr-TR") : "",
      DIL: ranks.DIL ? ranks.DIL.toLocaleString("tr-TR") : "",
    });
  }, [ranks]);

  const handleRankInput = (st: ScoreType, rawVal: string) => {
    // Keep raw string in text input for seamless typing
    setRankTexts((prev) => ({ ...prev, [st]: rawVal }));

    // Strip dots, commas, spaces to get integer
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

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            2026 YKS Başarı Sıralamanız ve Puanlarınız
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hesaplama yapılmasını istediğiniz puan türündeki 2026 başarı sıralamanızı yazınız (Örn: 275.000 veya 275000).
          </p>
        </div>

        {/* Score Type Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {SCORE_TYPES.map((st) => (
            <button
              key={st.type}
              onClick={() => onScoreTypeSelect(st.type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeScoreType === st.type
                  ? `bg-indigo-600 text-white shadow-md shadow-indigo-600/30`
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {st.type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Inputs for SAY, EA, SOZ, DIL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SCORE_TYPES.map((st) => {
          const isSelected = activeScoreType === st.type;

          return (
            <div
              key={st.type}
              onClick={() => onScoreTypeSelect(st.type)}
              className={`relative cursor-pointer rounded-xl p-4 transition-all border ${
                isSelected
                  ? "bg-slate-800/90 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50"
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${st.color}`}>
                  {st.label}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                )}
              </div>

              {/* Rank Input */}
              <div className="mb-3">
                <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-slate-500" />
                  2026 Başarı Sıralaması *
                </label>
                <input
                  type="text"
                  placeholder="Örn: 275.000 veya 95000"
                  value={rankTexts[st.type]}
                  onChange={(e) => handleRankInput(st.type, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-sm font-semibold text-white placeholder-slate-600 outline-none transition-all"
                />
              </div>

              {/* Score Input (Optional) */}
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Award className="w-3 h-3 text-slate-500" />
                  Puan (Opsiyonel)
                </label>
                <input
                  type="text"
                  placeholder="Örn: 412,50"
                  value={scoreTexts[st.type]}
                  onChange={(e) => handleScoreInput(st.type, e.target.value)}
                  className="w-full bg-slate-900/70 border border-slate-800 focus:border-slate-600 rounded-lg px-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 outline-none transition-all"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
