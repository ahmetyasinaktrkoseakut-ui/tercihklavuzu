"use client";

import React, { useState, useMemo } from "react";
import { UniversityProgram, ScoreType, UserRanks } from "../types/program";
import { calculateChance, ProgramChanceResult } from "../utils/chanceCalculator";
import { ProgramTable } from "./ProgramTable";
import { Search, Target, BookOpen, Sparkles, Filter } from "lucide-react";

interface TargetDepartmentSearchProps {
  programs: UniversityProgram[];
  userRanks: UserRanks;
  activeScoreType: ScoreType;
  favoritedIds: Set<string>;
  onToggleFavorite: (program: UniversityProgram) => void;
  onOpenConditionsModal: (conditions: string, programName: string) => void;
}

export const TargetDepartmentSearch: React.FC<TargetDepartmentSearchProps> = ({
  programs,
  userRanks,
  activeScoreType,
  favoritedIds,
  onToggleFavorite,
  onOpenConditionsModal,
}) => {
  const [targetQuery, setTargetQuery] = useState("");
  const [selectedChanceFilter, setSelectedChanceFilter] = useState<string>("ALL");

  const currentRank = userRanks[activeScoreType] || null;

  // Filter programs specifically for the target department
  const filteredPrograms = useMemo(() => {
    if (!targetQuery.trim()) return [];

    const queryLower = targetQuery.trim().toLowerCase();

    return programs.filter((p) => {
      const deptMatch = p.department.toLowerCase().includes(queryLower);
      const scoreTypeMatch = p.scoreType === activeScoreType;

      if (!deptMatch || !scoreTypeMatch) return false;

      if (selectedChanceFilter !== "ALL") {
        const chance = calculateChance(p.rank2025, currentRank);
        if (chance.category !== selectedChanceFilter) return false;
      }

      return true;
    });
  }, [programs, targetQuery, activeScoreType, selectedChanceFilter, currentRank]);

  // Suggested popular department tags
  const POPULAR_DEPTS = [
    "Bilgisayar Mühendisliği",
    "Yazılım Mühendisliği",
    "Hukuk",
    "Tıp",
    "Diş Hekimliği",
    "Psikoloji",
    "İşletme",
    "Mimarlık",
    "İlköğretim Matematik Öğretmenliği",
    "İngilizce Öğretmenliği",
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/30">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Hedef Bölüm Bazlı Tercih & İhtimal Arama
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              İstediğiniz spesifik bölümü yazın ({activeScoreType} türünde); sistem başarı sıralamanıza göre o bölümün gelebileceği tüm üniversiteleri ve ihtimal durumlarını listelesin.
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-6 relative max-w-3xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Hedeflediğiniz Bölüm Adını Yazınız... (Örn: Bilgisayar Mühendisliği, Hukuk, Tıp)"
            value={targetQuery}
            onChange={(e) => setTargetQuery(e.target.value)}
            className="w-full bg-slate-950 border border-indigo-500/40 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 rounded-xl pl-12 pr-4 py-3.5 text-base font-semibold text-white placeholder-slate-500 outline-none shadow-inner transition-all"
          />
        </div>

        {/* Popular Tags */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Popüler Aramalar:
          </span>
          {POPULAR_DEPTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setTargetQuery(dept)}
              className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 hover:bg-indigo-600 hover:text-white border border-slate-700 transition-all"
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {targetQuery.trim() ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">
                &quot;{targetQuery}&quot; Bölümüne Ait Sonuçlar ({filteredPrograms.length})
              </h3>
            </div>

            {/* Sub-filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> İhtimal:
              </span>
              <select
                value={selectedChanceFilter}
                onChange={(e) => setSelectedChanceFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
              >
                <option value="ALL">Tüm İhtimaller</option>
                <option value="GELME_IHTIMALI">Gelme İhtimali Var (Rekabet)</option>
                <option value="KESIN_GARANTI">Kesin / Garanti</option>
                <option value="ZOR_SURPRIZ">Zor İhtimal (Sürpriz)</option>
                <option value="YENI_DOLMAYAN">Yeni / Dolmayan</option>
              </select>
            </div>
          </div>

          <ProgramTable
            programs={filteredPrograms}
            userRank={currentRank}
            favoritedIds={favoritedIds}
            onToggleFavorite={onToggleFavorite}
            onOpenConditionsModal={onOpenConditionsModal}
          />
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-200">Aramak İstediğiniz Bölümü Yazın</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Yukarıdaki kutucuğa hedeflediğiniz bölüm adını girdiğinizde, sıralamanıza uygun tüm üniversiteler ihtimal derecelerine göre anında listelenecektir.
          </p>
        </div>
      )}
    </div>
  );
};
