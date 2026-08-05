"use client";

import React, { useState, useEffect } from "react";
import { ScoreType, UserRanks, UserScores } from "../types/program";
import { Award, Hash, Zap, CheckCircle2, RotateCcw } from "lucide-react";

interface UserRankInputProps {
  ranks: UserRanks;
  scores: UserScores;
  activeScoreType: ScoreType;
  onRankChange: (type: ScoreType, value: number | null) => void;
  onScoreChange: (type: ScoreType, value: number | null) => void;
  onScoreTypeSelect: (type: ScoreType) => void;
  onResetToDefaults?: () => void;
}

const SCORE_TYPES: { type: ScoreType; label: string; color: string; bg: string }[] = [
  { type: "SAY", label: "Sayısal (SAY)", color: "text-cyan-400", bg: "from-cyan-500/20 to-blue-500/20" },
  { type: "EA", label: "Eşit Ağırlık (EA)", color: "text-amber-400", bg: "from-amber-500/20 to-orange-500/20" },
  { type: "SOZ", label: "Sözel (SÖZ)", color: "text-purple-400", bg: "from-purple-500/20 to-pink-500/20" },
  { type: "DIL", label: "Dil (DİL)", color: "text-emerald-400", bg: "from-emerald-500/20 to-teal-500/20" },
  { type: "TYT", label: "TYT (Ön Lisans)", color: "text-blue-400", bg: "from-blue-500/20 to-indigo-500/20" },
];

export const UserRankInput: React.FC<UserRankInputProps> = ({
  ranks,
  scores,
  activeScoreType,
  onRankChange,
  onScoreChange,
  onScoreTypeSelect,
  onResetToDefaults,
}) => {
  // Local string states initialized with fixed YKS exam results
  const [rankTexts, setRankTexts] = useState<Record<ScoreType, string>>({
    SAY: ranks.SAY ? ranks.SAY.toLocaleString("tr-TR") : "722.465",
    EA: ranks.EA ? ranks.EA.toLocaleString("tr-TR") : "613.399",
    SOZ: ranks.SOZ ? ranks.SOZ.toLocaleString("tr-TR") : "431.601",
    DIL: ranks.DIL ? ranks.DIL.toLocaleString("tr-TR") : "",
    TYT: ranks.TYT ? ranks.TYT.toLocaleString("tr-TR") : "802.058",
  });

  const [scoreTexts, setScoreTexts] = useState<Record<ScoreType, string>>({
    SAY: scores.SAY ? strScore(scores.SAY) : "225,18384",
    EA: scores.EA ? strScore(scores.EA) : "266,81323",
    SOZ: scores.SOZ ? strScore(scores.SOZ) : "275,60440",
    DIL: scores.DIL ? strScore(scores.DIL) : "",
    TYT: scores.TYT ? strScore(scores.TYT) : "303,70941",
  });

  function strScore(val: number | null): string {
    if (!val) return "";
    return val.toString().replace(".", ",");
  }

  // Synchronize when ranks/scores update from localStorage or parent state
  useEffect(() => {
    setRankTexts({
      SAY: ranks.SAY ? ranks.SAY.toLocaleString("tr-TR") : "722.465",
      EA: ranks.EA ? ranks.EA.toLocaleString("tr-TR") : "613.399",
      SOZ: ranks.SOZ ? ranks.SOZ.toLocaleString("tr-TR") : "431.601",
      DIL: ranks.DIL ? ranks.DIL.toLocaleString("tr-TR") : "",
      TYT: ranks.TYT ? ranks.TYT.toLocaleString("tr-TR") : "802.058",
    });

    setScoreTexts({
      SAY: scores.SAY ? strScore(scores.SAY) : "225,18384",
      EA: scores.EA ? strScore(scores.EA) : "266,81323",
      SOZ: scores.SOZ ? strScore(scores.SOZ) : "275,60440",
      DIL: scores.DIL ? strScore(scores.DIL) : "",
      TYT: scores.TYT ? strScore(scores.TYT) : "303,70941",
    });
  }, [ranks.SAY, ranks.EA, ranks.SOZ, ranks.DIL, ranks.TYT, scores.SAY, scores.EA, scores.SOZ, scores.DIL, scores.TYT]);

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

  const hasAnyRank = ranks.SAY || ranks.EA || ranks.SOZ || ranks.DIL || ranks.TYT;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              2026 YKS Başarı Sıralamanız ve Puanlarınız
            </h2>

            {hasAnyRank && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Cihaza Otomatik Kaydedildi
              </span>
            )}
          </div>
          
          <p className="text-xs text-slate-400 mt-1">
            Resmi YKS sınav sonuç belgenizdeki SAY (722.465), EA (613.399), SÖZ (431.601) ve TYT (802.058) sıralamalarınız sabit olarak tanımlanmıştır.
          </p>
        </div>

        {/* Score Type Tabs & Reset Button */}
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
      </div>

      {/* Grid of Inputs for SAY, EA, SOZ, DIL, TYT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {SCORE_TYPES.map((st) => {
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
                  2026 Başarı Sıralaması *
                </label>
                <input
                  type="text"
                  placeholder="Örn: 431.601"
                  value={rankTexts[st.type]}
                  onChange={(e) => handleRankInput(st.type, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white placeholder-slate-600 outline-none transition-all"
                />
              </div>

              {/* Score Input (Optional) */}
              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Award className="w-3 h-3 text-slate-500" />
                  Puan (Opsiyonel)
                </label>
                <input
                  type="text"
                  placeholder="Örn: 303,70941"
                  value={scoreTexts[st.type]}
                  onChange={(e) => handleScoreInput(st.type, e.target.value)}
                  className="w-full bg-slate-900/70 border border-slate-800 focus:border-slate-600 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 placeholder-slate-600 outline-none transition-all"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
