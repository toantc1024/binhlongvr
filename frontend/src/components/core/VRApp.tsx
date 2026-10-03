import { useEffect } from "react";
import VRPage from "../pages/VRPage";
import TrackerBlock from "../block/TrackerBlock";
import { Toaster } from "../ui/sonner";
import NotFoundPage from "../pages/NotFoundPage";
import LandingPage from "../pages/LandingPage";
import { BrowserRouter, useLocation } from "react-router-dom";
import useVRStore from "@/store/vr.store";
import { cn } from "@/lib/utils";

const AppShell = () => {
  const location = useLocation();
  const isApp = location.pathname === "/app";
  const isHome = location.pathname === "/";
  const isNotFound = !isApp && !isHome;

  useEffect(() => {
    if (isApp) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isApp]);

  return (
    <>
      <TrackerBlock />
      <Toaster />

      {/* Trang chủ Landing Page */}
      <div className={cn("w-full min-h-screen", isHome ? "block" : "hidden")}>
        <LandingPage />
      </div>

      {/* Không gian VR 360° - Tách luồng tải 1 lần duy nhất, không reload khi chuyển trang */}
      <div
        className={cn(
          "w-full h-full",
          isApp
            ? "relative z-10 block pointer-events-auto opacity-100 visible"
            : "fixed inset-0 -z-50 pointer-events-none opacity-0 invisible"
        )}
      >
        <VRPage isActive={isApp} />
      </div>

      {/* 404 Not Found Page */}
      {isNotFound && <NotFoundPage />}
    </>
  );
};

const VRApp = () => {
  const { loadData } = useVRStore((state) => state);

  useEffect(() => {
    (async () => {
      await loadData();
    })();
  }, []);

  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
};

export default VRApp;
