"use client";

import React from "react";
import { FilterState, ChanceCategory, ScoreType } from "../types/program";
import { Search, Filter, MapPin, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, X, Star } from "lucide-react";

interface FilterBarProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  availableCities: string[];
  totalMatchCount: number;
  onReset: () => void;
}

const CHANCE_BUTTONS: { id: ChanceCategory; label: string; bg: string; activeBg: string; text: string; icon: React.ReactNode }[] = [
  {
    id: "TUMU",
    label: "Tümü",
    bg: "bg-slate-800/60 text-slate-300 hover:bg-slate-800",
    activeBg: "bg-indigo-600 text-white shadow-md shadow-indigo-600/30",
    text: "Tüm sonuçlar",
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: "GELME_IHTIMALI",
    label: "Gelme İhtimali Var (Rekabet)",
    bg: "bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30",
    activeBg: "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30",
    text: "[0.80 * S - 1.20 * S]",
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  {
    id: "KESIN_GARANTI",
    label: "Kesin / Garanti",
    bg: "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30",
    activeBg: "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30",
    text: "> 1.20 * S (120k ve üstü)",
    icon: <ShieldCheck className="w-4 h-4" />,
  },
  {
    id: "ZOR_SURPRIZ",
    label: "Zor İhtimal (Sürpriz)",
    bg: "bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30",
    activeBg: "bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30",
    text: "< 0.80 * S",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  {
    id: "YENI_DOLMAYAN",
    label: "Yeni Açılanlar / Dolmayanlar",
    bg: "bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 border border-blue-500/30",
    activeBg: "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30",
    text: "Dolmadı veya yeni",
    icon: <Star className="w-4 h-4" />,
  },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  setFilter,
  availableCities,
  totalMatchCount,
  onReset,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm space-y-5">
      {/* Top Search & City Selection */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Box */}
        <div className="md:col-span-7 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Üniversite, Bölüm veya Şehir adı ile ara... (Örn: İTÜ, Hukuk, Ankara)"
            value={filter.searchQuery}
            onChange={(e) => setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
          />
          {filter.searchQuery && (
            <button
              onClick={() => setFilter((prev) => ({ ...prev, searchQuery: "" }))}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* City Select */}
        <div className="md:col-span-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <MapPin className="w-4 h-4 text-slate-400" />
          </div>
          <select
            value={filter.selectedCity}
            onChange={(e) => setFilter((prev) => ({ ...prev, selectedCity: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="ALL">Tüm Şehirler ({availableCities.length})</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            ▼
          </div>
        </div>
      </div>

      {/* Chance Category Filter Pills */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            İhtimal Durumuna Göre Filtrele:
          </span>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              Bulunan: <strong className="text-indigo-400 font-bold">{totalMatchCount}</strong> program
            </span>
            {(filter.chanceCategory !== "TUMU" ||
              filter.selectedCity !== "ALL" ||
              filter.searchQuery !== "") && (
              <button
                onClick={onReset}
                className="text-xs text-rose-400 hover:text-rose-300 underline font-medium"
              >
                Filtreleri Temizle
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {CHANCE_BUTTONS.map((btn) => {
            const isActive = filter.chanceCategory === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setFilter((prev) => ({ ...prev, chanceCategory: btn.id }))}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive ? btn.activeBg : btn.bg
                }`}
              >
                {btn.icon}
                <span>{btn.label}</span>
                <span className="opacity-70 text-[10px] hidden sm:inline">({btn.text})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
