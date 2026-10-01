import logo3D from "@/assets/logo_binh_long_3d.png";

export const Logo = () => (
  <div className="flex items-center gap-2.5 cursor-pointer group select-none">
    <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
      <img src={logo3D} alt="Logo 3D Bình Long" className="w-full h-full object-contain filter drop-shadow-sm" />
    </div>
    <div className="flex flex-col text-left">
      <span className="font-semibold text-base sm:text-lg leading-tight text-foreground tracking-tight group-hover:text-primary transition-colors">
        Bản Đồ Số Bình Long
      </span>
      <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
        Phường Bình Long, TP. Đồng Nai
      </span>
    </div>
  </div>
);
