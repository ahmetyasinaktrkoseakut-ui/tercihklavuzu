"use client";

import React, { useState, useEffect, useMemo } from "react";
import { UniversityProgram, ScoreType, UserRanks, UserScores, FilterState } from "../types/program";
import { calculateChance, ProgramChanceResult } from "../utils/chanceCalculator";
import initialData from "../data/data.json";
import { Header } from "../components/Header";
import { UserRankInput } from "../components/UserRankInput";
import { FilterBar } from "../components/FilterBar";
import { ProgramTable } from "../components/ProgramTable";
import { TargetDepartmentSearch } from "../components/TargetDepartmentSearch";
import { PreferenceDrawer } from "../components/PreferenceDrawer";
import { DataImporterModal } from "../components/DataImporterModal";
import { SpecialConditionsModal } from "../components/SpecialConditionsModal";
import { Sparkles, Heart, FileCode, CheckCircle, Upload, Award } from "lucide-react";

export default function Home() {
  // 1. Data State (Default static data.json or imported dataset)
  const [programs, setPrograms] = useState<UniversityProgram[]>(initialData as UniversityProgram[]);

  // 2. Active Navigation Tab ("general" | "target" | "preferences")
  const [activeTab, setActiveTab] = useState<"general" | "target" | "preferences">("general");

  // 3. User Ranks & Scores (Sabit YKS Sınav Sonuçları)
  const [userRanks, setUserRanks] = useState<UserRanks>({
    SAY: 722465,
    EA: 613399,
    SOZ: 431601,
    DIL: null,
  });

  const [userScores, setUserScores] = useState<UserScores>({
    SAY: 225.18384,
    EA: 266.81323,
    SOZ: 275.60440,
    DIL: null,
  });

  const [activeScoreType, setActiveScoreType] = useState<ScoreType>("SAY");

  // 4. Filters State
  const [filter, setFilter] = useState<FilterState>({
    scoreType: "SAY",
    chanceCategory: "TUMU",
    selectedCity: "ALL",
    searchQuery: "",
    targetDepartment: "",
    onlyNewOrEmpty: false,
  });

  // 5. Favorited Preferences Basket
  const [preferences, setPreferences] = useState<UniversityProgram[]>([]);

  // 6. Modals
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [conditionsModal, setConditionsModal] = useState<{ isOpen: boolean; text: string; name: string }>({
    isOpen: false,
    text: "",
    name: "",
  });

  // Load saved ranks & preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedRanks = localStorage.getItem("yks_user_ranks");
      if (savedRanks) setUserRanks(JSON.parse(savedRanks));

      const savedScores = localStorage.getItem("yks_user_scores");
      if (savedScores) setUserScores(JSON.parse(savedScores));

      const savedPrefs = localStorage.getItem("yks_preferences");
      if (savedPrefs) setPreferences(JSON.parse(savedPrefs));

      const customData = localStorage.getItem("yks_custom_data");
      if (customData) {
        const parsed = JSON.parse(customData);
        if (Array.isArray(parsed) && parsed.length > 0) setPrograms(parsed);
      }
    } catch (err) {
      console.error("LocalStorage load error:", err);
    }
  }, []);

  // Sync ranks to localStorage
  const handleRankChange = (type: ScoreType, value: number | null) => {
    const updated = { ...userRanks, [type]: value };
    setUserRanks(updated);
    localStorage.setItem("yks_user_ranks", JSON.stringify(updated));
  };

  const handleScoreChange = (type: ScoreType, value: number | null) => {
    const updated = { ...userScores, [type]: value };
    setUserScores(updated);
    localStorage.setItem("yks_user_scores", JSON.stringify(updated));
  };

  // Sync preferences to localStorage
  const handleToggleFavorite = (program: UniversityProgram) => {
    const exists = preferences.some((p) => p.id === program.id);
    let updated: UniversityProgram[];
    if (exists) {
      updated = preferences.filter((p) => p.id !== program.id);
    } else {
      updated = [...preferences, program];
    }
    setPreferences(updated);
    localStorage.setItem("yks_preferences", JSON.stringify(updated));
  };

  const handleReorderPreferences = (newOrder: UniversityProgram[]) => {
    setPreferences(newOrder);
    localStorage.setItem("yks_preferences", JSON.stringify(newOrder));
  };

  const handleClearPreferences = () => {
    setPreferences([]);
    localStorage.removeItem("yks_preferences");
  };

  const handleImportPrograms = (newPrograms: UniversityProgram[]) => {
    setPrograms(newPrograms);
    localStorage.setItem("yks_custom_data", JSON.stringify(newPrograms));
  };

  // Set of favorited IDs for O(1) lookup
  const favoritedIds = useMemo(() => {
    return new Set(preferences.map((p) => p.id));
  }, [preferences]);

  // Extract unique sorted cities for dropdown
  const availableCities = useMemo(() => {
    const citiesSet = new Set<string>();
    programs.forEach((p) => {
      if (p.city) citiesSet.add(p.city);
    });
    return Array.from(citiesSet).sort((a, b) => a.localeCompare(b, "tr"));
  }, [programs]);

  // High Performance Client-Side Filtering with useMemo
  const filteredPrograms = useMemo(() => {
    const currentRank = userRanks[activeScoreType] || null;
    const queryLower = filter.searchQuery.trim().toLowerCase();

    return programs.filter((prog) => {
      // 1. Score Type Match
      if (prog.scoreType !== activeScoreType) return false;

      // 2. City Match
      if (filter.selectedCity !== "ALL" && prog.city !== filter.selectedCity) {
        return false;
      }

      // 3. Search Query (University, Department, City)
      if (queryLower) {
        const uMatch = prog.universityName.toLowerCase().includes(queryLower);
        const dMatch = prog.department.toLowerCase().includes(queryLower);
        const cMatch = prog.city.toLowerCase().includes(queryLower);
        const fMatch = prog.faculty.toLowerCase().includes(queryLower);
        if (!uMatch && !dMatch && !cMatch && !fMatch) return false;
      }

      // 4. Chance Category Filter
      if (filter.chanceCategory !== "TUMU") {
        const chance = calculateChance(prog.rank2025, currentRank);
        if (chance.category !== filter.chanceCategory) return false;
      }

      return true;
    });
  }, [programs, activeScoreType, filter, userRanks]);

  const currentRank = userRanks[activeScoreType] || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        preferenceCount={preferences.length}
        onOpenImporter={() => setIsImporterOpen(true)}
        programCount={programs.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 print:hidden">
        
        {/* Prominent Hero Title Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
            <Award className="w-3.5 h-3.5 text-amber-400" /> Resmi ÖSYM Devlet Üniversitesi Veri Tabanı
          </span>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Ahmet Yasin Aktürk Tarafından Hazırlanan <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">2026 Tercih Kılavuzu</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mt-2">
            12.042 Devlet Üniversitesi programı üzerinden gelişmiş ihtimal hesaplama, bölüm bazlı hedef arama ve tercih listesi robotu
          </p>
        </div>

        {/* User Rank Input Section */}
        <UserRankInput
          ranks={userRanks}
          scores={userScores}
          activeScoreType={activeScoreType}
          onRankChange={handleRankChange}
          onScoreChange={handleScoreChange}
          onScoreTypeSelect={(st) => {
            setActiveScoreType(st);
            setFilter((prev) => ({ ...prev, scoreType: st }));
          }}
        />

        {/* Tab 1: General Preference Robot */}
        {activeTab === "general" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter Bar */}
            <FilterBar
              filter={filter}
              setFilter={setFilter}
              availableCities={availableCities}
              totalMatchCount={filteredPrograms.length}
              onReset={() =>
                setFilter({
                  scoreType: activeScoreType,
                  chanceCategory: "TUMU",
                  selectedCity: "ALL",
                  searchQuery: "",
                  targetDepartment: "",
                  onlyNewOrEmpty: false,
                })
              }
            />

            {/* Results Table & Cards */}
            <ProgramTable
              programs={filteredPrograms}
              userRank={currentRank}
              favoritedIds={favoritedIds}
              onToggleFavorite={handleToggleFavorite}
              onOpenConditionsModal={(text, name) =>
                setConditionsModal({ isOpen: true, text, name })
              }
            />
          </div>
        )}

        {/* Tab 2: Target Department Search */}
        {activeTab === "target" && (
          <div className="animate-fadeIn">
            <TargetDepartmentSearch
              programs={programs}
              userRanks={userRanks}
              activeScoreType={activeScoreType}
              favoritedIds={favoritedIds}
              onToggleFavorite={handleToggleFavorite}
              onOpenConditionsModal={(text, name) =>
                setConditionsModal({ isOpen: true, text, name })
              }
            />
          </div>
        )}

        {/* Tab 3: Preference Basket */}
        {activeTab === "preferences" && (
          <div className="animate-fadeIn">
            <PreferenceDrawer
              preferences={preferences}
              userRank={currentRank}
              onRemove={(id) => handleToggleFavorite({ id } as UniversityProgram)}
              onReorder={handleReorderPreferences}
              onClearAll={handleClearPreferences}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 print:hidden text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Ahmet Yasin Aktürk Tarafından Hazırlanan Tercih Kılavuzu</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Client-Side Fast Filtering</span>
            <span>•</span>
            <span>ÖSYM Resmi Devlet Üniversiteleri Veri Tabanı</span>
          </div>
        </div>
      </footer>

      {/* Dedicated Print View (Visible only during window.print()) */}
      <div className="hidden print:block p-8 bg-white text-black font-sans">
        <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider">Ahmet Yasin Aktürk 2026 Tercih Kılavuzu</h1>
            <p className="text-xs text-gray-600">ÖSYM Resmi Tercih Bildirimi Çalışma Taslağı</p>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold">Toplam Tercih: {preferences.length} / 24</p>
            <p>Tarih: {new Date().toLocaleDateString("tr-TR")}</p>
          </div>
        </div>

        <table className="w-full text-left text-xs border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 font-bold">
              <th className="p-2 border border-gray-300 w-8 text-center">Sıra</th>
              <th className="p-2 border border-gray-300">Üniversite Adı</th>
              <th className="p-2 border border-gray-300">Fakülte & Bölüm</th>
              <th className="p-2 border border-gray-300">Şehir</th>
              <th className="p-2 border border-gray-300 text-center">Tür</th>
              <th className="p-2 border border-gray-300 text-right">2025 Sıralaması</th>
              <th className="p-2 border border-gray-300 text-right">Kontenjan</th>
            </tr>
          </thead>
          <tbody>
            {preferences.map((prog, idx) => (
              <tr key={prog.id} className="border-b border-gray-200">
                <td className="p-2 border border-gray-300 text-center font-bold">{idx + 1}</td>
                <td className="p-2 border border-gray-300 font-semibold">{prog.universityName}</td>
                <td className="p-2 border border-gray-300">{prog.department} ({prog.faculty})</td>
                <td className="p-2 border border-gray-300">{prog.city}</td>
                <td className="p-2 border border-gray-300 text-center font-bold">{prog.scoreType}</td>
                <td className="p-2 border border-gray-300 text-right font-mono font-bold">
                  {prog.rank2025 ? prog.rank2025.toLocaleString("tr-TR") : "Dolmadı / Yeni"}
                </td>
                <td className="p-2 border border-gray-300 text-right font-mono">{prog.quota || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 text-xs text-gray-500 border-t border-gray-200 pt-4">
          <p>* Bu liste Ahmet Yasin Aktürk 2026 Tercih Kılavuzu tarafından bilgilendirme amacıyla oluşturulmuştur. Resmî tercihlerinizi ÖSYM AİS sistemi üzerinden onaylamayı unutmayınız.</p>
        </div>
      </div>

      {/* Modals */}
      <DataImporterModal
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
        onImport={handleImportPrograms}
        currentCount={programs.length}
      />

      <SpecialConditionsModal
        isOpen={conditionsModal.isOpen}
        onClose={() => setConditionsModal((prev) => ({ ...prev, isOpen: false }))}
        conditions={conditionsModal.text}
        programName={conditionsModal.name}
      />
    </div>
  );
}
