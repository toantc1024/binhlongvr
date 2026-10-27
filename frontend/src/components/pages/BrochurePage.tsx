import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Printer,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layers,
  ArrowLeft,
  Download,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const BrochurePage: React.FC = () => {
  // Modes: "flip" (3D book reading) or "grid" (All 4 pages view)
  const [viewMode, setViewMode] = useState<"flip" | "grid">("flip");
  // Flip step: 0 = Front Cover (Page 1), 1 = Inside Spread (Pages 2 & 3), 2 = Back Cover (Page 4)
  const [flipStep, setFlipStep] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#010d09] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white print:bg-white print:text-black">
      {/* Top Action Bar (Hidden when printing) */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#021710]/95 border-b border-emerald-900/40 px-4 py-3 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về Trang chủ</span>
            </Link>

            <div className="h-5 w-px bg-slate-700 hidden sm:block" />

            <div>
              <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Ấn Phẩm Tờ Gấp Phường Bình Long
              </h1>
              <p className="text-xs text-slate-400 hidden md:block">
                Bộ ấn phẩm số hóa 4 trang chuẩn marketing (Khổ in A4 / A5)
              </p>
            </div>
          </div>

          {/* Mode Switchers and Actions */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-900/90 p-1 rounded-lg border border-slate-700 flex items-center text-xs">
              <button
                onClick={() => setViewMode("flip")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  viewMode === "flip"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Lật xem thực tế</span>
              </button>

              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Xem cả 4 trang</span>
              </button>
            </div>

            <a
              href="/flipbook/to_gap_binh_long_4_trang.pdf"
              download="to_gap_binh_long_4_trang.pdf"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm px-3.5 py-1.5 h-auto rounded-lg shadow-lg shadow-emerald-900/40 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Tải PDF 4 Trang</span>
            </a>

            <Button
              onClick={handlePrint}
              variant="outline"
              className="border-emerald-600/50 text-emerald-300 hover:bg-emerald-950 font-medium text-xs sm:text-sm px-3 py-1.5 h-auto rounded-lg hidden sm:flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In ngay</span>
            </Button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 cursor-pointer"
              title="Sao chép liên kết"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Share Toast */}
      {copied && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Đã sao chép liên kết vào bộ nhớ tạm!</span>
        </div>
      )}

      {/* MAIN VIEW CONTENT */}
      <main className="flex-1 py-6 sm:py-10 px-2 sm:px-6 flex flex-col items-center justify-start print:p-0 print:m-0">
        {/* ========================================================= */}
        {/* VIEW MODE 1: INTERACTIVE 3D FLIP VIEWER                   */}
        {/* ========================================================= */}
        {viewMode === "flip" && (
          <div className="w-full max-w-6xl flex flex-col items-center print:hidden">
            {/* Step Indicator */}
            <div className="flex items-center gap-3 mb-6 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-full text-xs sm:text-sm">
              <button
                onClick={() => setFlipStep(0)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  flipStep === 0
                    ? "bg-emerald-600 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Trang 1: Bìa Trước
              </button>
              <span className="text-slate-600">→</span>
              <button
                onClick={() => setFlipStep(1)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  flipStep === 1
                    ? "bg-emerald-600 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Trang 2 & 3: Giới Thiệu & Số Hóa
              </button>
              <span className="text-slate-600">→</span>
              <button
                onClick={() => setFlipStep(2)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  flipStep === 2
                    ? "bg-emerald-600 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Trang 4: Bìa Sau
              </button>
            </div>

            {/* Interactive Book Container */}
            <div className="relative w-full flex justify-center items-center py-4">
              {/* Previous Button */}
              <button
                disabled={flipStep === 0}
                onClick={() => setFlipStep((prev) => Math.max(0, prev - 1))}
                className={`absolute left-0 sm:left-4 z-20 p-3 rounded-full bg-slate-900/90 border border-slate-700 text-white transition-all shadow-xl hover:bg-emerald-600 ${
                  flipStep === 0 ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:scale-105"
                }`}
                aria-label="Lật trang trước"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* BOOK VISUALIZATION */}
              <div className="transition-all duration-700 ease-out flex justify-center">
                {/* STEP 0: FRONT COVER (PAGE 1) */}
                {flipStep === 0 && (
                  <div
                    onClick={() => setFlipStep(1)}
                    className="cursor-pointer group relative bg-[#021710] rounded-r-2xl rounded-l-md shadow-2xl overflow-hidden border-2 border-emerald-500/40 transition-all duration-300 hover:shadow-emerald-900/40 w-[340px] sm:w-[420px] md:w-[480px] aspect-[1/1.414]"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/50 via-black/20 to-transparent z-30 pointer-events-none" />
                    <img
                      src="/flipbook/page_1.png"
                      alt="Trang 1: Bìa trước"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end pr-6 pointer-events-none">
                      <span className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                        Nhấn để mở 2 trang trong <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                )}

                {/* STEP 1: INSIDE SPREAD (PAGE 2 & PAGE 3 OPENED) */}
                {flipStep === 1 && (
                  <div className="relative flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden border-2 border-emerald-500/40 max-w-[960px] w-full bg-[#021710]">
                    {/* Left Inside Page (Page 2) */}
                    <div className="relative flex-1 aspect-[1/1.414] overflow-hidden border-b md:border-b-0 md:border-r border-emerald-900/50">
                      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/40 via-black/10 to-transparent z-30 pointer-events-none hidden md:block" />
                      <img
                        src="/flipbook/page_2.png"
                        alt="Trang 2: Giới thiệu"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Right Inside Page (Page 3) */}
                    <div className="relative flex-1 aspect-[1/1.414] overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/40 via-black/10 to-transparent z-30 pointer-events-none hidden md:block" />
                      <img
                        src="/flipbook/page_3.png"
                        alt="Trang 3: Số hóa & Mã QR"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: BACK COVER (PAGE 4) */}
                {flipStep === 2 && (
                  <div
                    onClick={() => setFlipStep(1)}
                    className="cursor-pointer group relative bg-[#021710] rounded-l-2xl rounded-r-md shadow-2xl overflow-hidden border-2 border-emerald-500/40 transition-all duration-300 hover:shadow-emerald-900/40 w-[340px] sm:w-[420px] md:w-[480px] aspect-[1/1.414]"
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-black/50 via-black/20 to-transparent z-30 pointer-events-none" />
                    <img
                      src="/flipbook/page_4.png"
                      alt="Trang 4: Bìa sau"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-start pl-6 pointer-events-none">
                      <span className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                        <ChevronLeft className="w-3.5 h-3.5" /> Lật lại 2 trang trong
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Next Button */}
              <button
                disabled={flipStep === 2}
                onClick={() => setFlipStep((prev) => Math.min(2, prev + 1))}
                className={`absolute right-0 sm:right-4 z-20 p-3 rounded-full bg-slate-900/90 border border-slate-700 text-white transition-all shadow-xl hover:bg-emerald-600 ${
                  flipStep === 2 ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:scale-105"
                }`}
                aria-label="Lật trang tiếp theo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Quick Jump / Navigation */}
            <div className="flex items-center gap-4 mt-6 text-xs text-slate-400">
              <span>Đang xem:</span>
              <span className="text-emerald-400 font-semibold">
                {flipStep === 0 && "Trang 1: Bìa trước"}
                {flipStep === 1 && "Trang 2 & 3: Giới thiệu & Số hóa"}
                {flipStep === 2 && "Trang 4: Bìa sau"}
              </span>
              <span>•</span>
              <button
                onClick={() => setViewMode("grid")}
                className="underline hover:text-emerald-300 cursor-pointer"
              >
                Chuyển sang chế độ xem cả 4 trang
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW MODE 2: ALL 4 PAGES IN A CLEAN GRID / STACK          */}
        {/* ========================================================= */}
        {viewMode === "grid" && (
          <div className="w-full max-w-6xl flex flex-col items-center gap-8 print:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
              {/* Page 1 */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  Trang 1: Bìa Trước
                </span>
                <div className="w-full aspect-[1/1.414] rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-xl bg-[#021710]">
                  <img
                    src="/flipbook/page_1.png"
                    alt="Trang 1"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Page 2 */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  Trang 2: Giới Thiệu Di Tích
                </span>
                <div className="w-full aspect-[1/1.414] rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-xl bg-[#021710]">
                  <img
                    src="/flipbook/page_2.png"
                    alt="Trang 2"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Page 3 */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  Trang 3: Ứng Dụng Số Hóa & Mã QR
                </span>
                <div className="w-full aspect-[1/1.414] rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-xl bg-[#021710]">
                  <img
                    src="/flipbook/page_3.png"
                    alt="Trang 3"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Page 4 */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  Trang 4: Bìa Sau (Khám Phá & Liên Hệ)
                </span>
                <div className="w-full aspect-[1/1.414] rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-xl bg-[#021710]">
                  <img
                    src="/flipbook/page_4.png"
                    alt="Trang 4"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BrochurePage;
