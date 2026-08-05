"use client";

import React from "react";
import { X, BookOpen, CheckCircle2, AlertTriangle, ShieldCheck, Star, Target, Printer, Zap, Award, Layers } from "lucide-react";

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn print:hidden">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                2026 YKS Tercih Robotu Kullanım Kılavuzu & Rehberi
              </h2>
              <p className="text-xs text-slate-400">
                Sistemi bilgisayardan ve mobilden en verimli şekilde kullanma rehberi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable Visual Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border border-indigo-500/30 rounded-xl p-4 sm:p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-amber-400" />
              Sistem Nasıl Çalışır?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bu kılavuz, ÖSYM&apos;nin 2.956 resmî Devlet Üniversitesi programı üzerinden başarı sıralamalarınıza uygun bölümleri doğru analiz etmeniz için hazırlanmıştır. İndirme yapmadan doğrudan ekranınızda adım adım inceleyebilirsiniz.
            </p>
          </div>

          {/* Adım 1 */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h4 className="text-sm font-bold text-white">Sınav Sıralaması & Puan Kartları Paneli</h4>
            </div>

            <p className="text-xs text-slate-400 pl-8">
              Resmî sınav sonuç belgenizdeki <strong>SAY</strong>, <strong>EA</strong>, <strong>SÖZ</strong> ve <strong>TYT</strong> sıralamalarınız cihaz odaklı sabit olarak tanımlanmıştır.
            </p>

            <div className="pl-8 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
                <span className="font-bold text-cyan-400 block">SAY</span>
                <span className="text-slate-300">722.465</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
                <span className="font-bold text-amber-400 block">EA</span>
                <span className="text-slate-300">613.399</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
                <span className="font-bold text-purple-400 block">SÖZ</span>
                <span className="text-slate-300">431.601</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
                <span className="font-bold text-blue-400 block">TYT</span>
                <span className="text-slate-300">802.058</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-indigo-500/50 text-center">
                <span className="font-bold text-indigo-400 block flex items-center justify-center gap-1">
                  <Layers className="w-3 h-3" /> TÜMÜ
                </span>
                <span className="text-slate-400 text-[10px]">Tüm Türler</span>
              </div>
            </div>
          </div>

          {/* Adım 2 */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="text-sm font-bold text-white">İhtimal Hesaplama Formülü & Renk Anlamları</h4>
            </div>

            <p className="text-xs text-slate-400 pl-8">
              Bölümlerin 2025 En Düşük (Taban) Başarı Sıralaması (R) ile sizin başarı sıranız (S) karşılaştırılarak 4 kategoriye ayrılır:
            </p>

            <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-300 block">Kesin / Garanti (&gt; 1.20 x S)</span>
                  <span className="text-[11px] text-slate-300">
                    Bölümün sıralaması sizin sıranızdan belirgin derecede düşük olan güvenli bölgedir. Açıkta kalmanızı engeller.
                  </span>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300 block">Gelme İhtimali Var ([0.80 x S, 1.20 x S])</span>
                  <span className="text-[11px] text-slate-300">
                    Sıralamanızın %20 üstü ve %20 altı arasındaki gerçek rekabet bölgesidir.
                  </span>
                </div>
              </div>

              <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-300 block">Zor İhtimal / Sürpriz (&lt; 0.80 x S)</span>
                  <span className="text-[11px] text-slate-300">
                    Sıralamanızın üstündeki hayal / sürpriz bölgedir.
                  </span>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-xl flex items-start gap-2.5">
                <Star className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-blue-300 block">Yeni Açılanlar / Dolmayanlar</span>
                  <span className="text-[11px] text-slate-300">
                    Taban puanı henüz oluşmamış yeni Devlet Üniversitesi kontenjanlarıdır.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Adım 3 */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h4 className="text-sm font-bold text-white">Hedef Bölüm Bazlı Arama Sekmesi</h4>
            </div>

            <p className="text-xs text-slate-400 pl-8">
              &quot;Hedef Bölüm Arama&quot; sekmesinde spesifik bir bölüm adı (örneğin <em>Hukuk</em>, <em>Bilgisayar Mühendisliği</em>, <em>Tıp</em>, <em>Psikoloji</em>) aradığınızda, Türkiye genelindeki tüm Devlet Üniversiteleri başarı sıranıza göre anında listelenir.
            </p>
          </div>

          {/* Adım 4 */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                4
              </span>
              <h4 className="text-sm font-bold text-white">Filtrelenmiş Sonuçları PDF İndirme & Yazdırma</h4>
            </div>

            <p className="text-xs text-slate-400 pl-8">
              Filtre panelindeki <strong className="text-white">&quot;Filtrelenmiş Sonuçları PDF İndir / Yazdır&quot;</strong> butonuna bastığınızda, örneğin sadece <strong>Kesin / Garanti</strong> olanları seçtiyseniz yalnızca Kesin olan programlar resmî PDF formatında çıktılanır.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            Anlaşıldı, Kılavuzu Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
