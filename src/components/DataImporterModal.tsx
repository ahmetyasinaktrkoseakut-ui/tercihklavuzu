"use client";

import React, { useState } from "react";
import { UniversityProgram } from "../types/program";
import { X, Upload, FileCode, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

interface DataImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (programs: UniversityProgram[]) => void;
  currentCount: number;
}

export const DataImporterModal: React.FC<DataImporterModalProps> = ({
  isOpen,
  onClose,
  onImport,
  currentCount,
}) => {
  const [jsonInput, setJsonInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImport(parsed as UniversityProgram[]);
          setSuccessMsg(`${parsed.length} adet program başarıyla yüklendi!`);
          setErrorMsg("");
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setErrorMsg("Yüklenen JSON dosyası geçerli bir liste (array) içermiyor.");
        }
      } catch (err) {
        setErrorMsg("JSON dosyası ayrıştırılamadı. Geçerli bir JSON biçimi olduğundan emin olun.");
      }
    };
    reader.readAsText(file);
  };

  const handleManualImport = () => {
    if (!jsonInput.trim()) {
      setErrorMsg("Lütfen geçerli JSON metni giriniz.");
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed)) {
        onImport(parsed as UniversityProgram[]);
        setSuccessMsg(`${parsed.length} adet program başarıyla yüklendi!`);
        setErrorMsg("");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrorMsg("Girilen JSON metni geçerli bir dizi içermiyor.");
      }
    } catch (err) {
      setErrorMsg("Sözdizimi hatası: Metin geçerli bir JSON formatında değil.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Veri Seti Yükle / PDF Entegrasyonu</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Sistemde şu an <strong className="text-indigo-400">{currentCount}</strong> adet veri yüklü. PDF veya JSON formatındaki verinizi aktarabilirsiniz.
            </p>
          </div>
        </div>

        {/* Option 1: File Upload */}
        <div className="bg-slate-950/80 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-6 text-center transition-all">
          <FileCode className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-200">data.json veya Hazır JSON Dosyanızı Yükleyin</h4>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Bilgisayarınızdaki `.json` dosyasını seçerek anında yükleyebilirsiniz.
          </p>

          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/30 transition-all">
            <Upload className="w-4 h-4" />
            JSON Dosyası Seç
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Option 2: Paste JSON Text */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">
            Veya JSON Metnini Doğrudan Yapıştırın:
          </label>
          <textarea
            rows={5}
            placeholder='[{"id":"1", "universityName":"İTÜ", "department":"Bilgisayar Mühendisliği", "city":"İstanbul", "scoreType":"SAY", "quota":60, "rank2025":1200, "score2025":520.4}]'
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-lg font-bold">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            Dosya kök dizindeki <code>data.json</code> alanına da yazılabilir.
          </div>

          <button
            onClick={handleManualImport}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md transition-all"
          >
            Metni Yükle
          </button>
        </div>
      </div>
    </div>
  );
};
