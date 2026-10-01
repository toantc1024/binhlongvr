import logo3D from "@/assets/logo_binh_long_3d.png";
import binhLongSunsetImg from "@/assets/carousel_images/binh_long_sunset.jpg";

const LoaderBlock = () => {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden select-none bg-slate-950">
      {/* Background: Aerial sunset photo of Bình Long with cinematic atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={binhLongSunsetImg}
          alt="Bình Long Hoàng Hôn"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.38] contrast-105 blur-[1.5px] transition-transform duration-[15000ms] ease-out animate-pulse"
        />
        {/* Layered cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,150,105,0.18)_0%,transparent_70%)]" />
      </div>

      {/* Center 3D Logo Showcase */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm sm:max-w-md">
        {/* 3D Medallion Emblem with Orbital Rings */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Ambient soft glow */}
          <div className="absolute -inset-6 rounded-full bg-emerald-500/25 blur-2xl animate-pulse" />

          {/* Rotating dashed ring */}
          <div className="absolute -inset-4 rounded-full border border-dashed border-emerald-400/40 animate-spin [animation-duration:14s]" />

          {/* Accent thin orbital halo */}
          <div className="absolute -inset-2 rounded-full border border-emerald-400/30" />

          {/* 3D Binh Long Logo */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center transition-transform duration-500 hover:scale-105 pointer-events-none">
            <img
              src={logo3D}
              alt="Logo 3D Bình Long"
              className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
            />
          </div>
        </div>

        {/* Brand Title & Subtitle */}
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white drop-shadow-md">
          Bản Đồ Số Bình Long
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-emerald-200/80 font-normal tracking-wide drop-shadow-sm">
          Không gian Di sản & Thực tế ảo 360°
        </p>

        {/* Modern Sleek Loading Bar */}
        <div className="mt-7 w-48 sm:w-56 flex flex-col items-center gap-2.5">
          <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden backdrop-blur-sm relative">
            <div className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 rounded-full animate-pulse w-full" />
          </div>
          <span className="text-[11px] text-slate-300/80 font-normal tracking-wider">
            Đang tải không gian số hóa...
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoaderBlock;
