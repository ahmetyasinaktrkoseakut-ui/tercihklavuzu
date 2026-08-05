"use client";

import React from "react";
import { GraduationCap, Heart, Upload, Search, ListOrdered, Sparkles, BookOpen } from "lucide-react";

interface HeaderProps {
  activeTab: "general" | "target" | "preferences";
  setActiveTab: (tab: "general" | "target" | "preferences") => void;
  preferenceCount: number;
  onOpenImporter: () => void;
  programCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  preferenceCount,
  onOpenImporter,
  programCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  YKS Tercih Robotu <span className="text-indigo-400">2026</span>
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {programCount.toLocaleString("tr-TR")} Program
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Statik JSON Tabanlı İhtimal Hesaplama & Tercih Danışmanı
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "general"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Genel Tercih Robotu
            </button>

            <button
              onClick={() => setActiveTab("target")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "target"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Hedef Bölüm Arama
            </button>

            <button
              onClick={() => setActiveTab("preferences")}
              className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "preferences"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              Tercih Listem
              {preferenceCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-pink-500 text-white rounded-full">
                  {preferenceCount}
                </span>
              )}
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenImporter}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/50 rounded-lg transition-all"
              title="Veri Yükle veya Güncelle"
            >
              <Upload className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Veri Yükle / PDF Entegre</span>
            </button>

            <button
              onClick={() => setActiveTab("preferences")}
              className="md:hidden relative p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300"
            >
              <Heart className="w-5 h-5 text-pink-500" />
              {preferenceCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {preferenceCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around border-t border-slate-800/60 py-2">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex flex-col items-center gap-1 text-xs font-medium px-3 py-1 rounded-lg ${
              activeTab === "general" ? "text-indigo-400" : "text-slate-400"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Genel Robot
          </button>

          <button
            onClick={() => setActiveTab("target")}
            className={`flex flex-col items-center gap-1 text-xs font-medium px-3 py-1 rounded-lg ${
              activeTab === "target" ? "text-indigo-400" : "text-slate-400"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Hedef Bölüm
          </button>

          <button
            onClick={() => setActiveTab("preferences")}
            className={`flex flex-col items-center gap-1 text-xs font-medium px-3 py-1 rounded-lg ${
              activeTab === "preferences" ? "text-indigo-400" : "text-slate-400"
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            Tercihlerim ({preferenceCount})
          </button>
        </div>
      </div>
    </header>
  );
};
