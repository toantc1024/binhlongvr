import LOGO_VR from "@/assets/LOGO_VR.png";

export const Logo = () => (
  <div className="flex items-center gap-2.5 cursor-pointer group select-none">
    <div className="w-10 h-10 rounded-full flex items-center justify-center p-0.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 shadow-xs transition-transform group-hover:scale-105">
      <img src={LOGO_VR} alt="Logo Bình Long" className="w-full h-full object-contain" />
    </div>
    <div className="flex flex-col text-left">
      <span className="font-bold text-base sm:text-lg leading-tight text-foreground tracking-tight group-hover:text-primary transition-colors">
        Bản Đồ Số Bình Long
      </span>
      <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        Thị xã Bình Long
      </span>
    </div>
  </div>
);
