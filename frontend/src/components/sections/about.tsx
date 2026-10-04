import { TextAnimate } from "../magicui/text-animate";
import { useMemo } from "react";

import historyArchive3DIcon from "@/assets/3d-icons/history-archive__binhlong-3d-icon.png";
import landmarkExplore3DIcon from "@/assets/3d-icons/landmark-explore__binhlong-3d-icon.png";
import vrAiTech3DIcon from "@/assets/3d-icons/vr-ai-tech__binhlong-3d-icon.png";
import interaction3DIcon from "@/assets/3d-icons/interaction__binhlong-3d-icon.png";



// 1. Simple abstract digital archive art for "Số hóa thông tin lịch sử"
const HistorySimpleAbstract = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none [mask-image:linear-gradient(to_bottom,black_45%,transparent_92%)]">
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-emerald-500/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -left-6 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl" />
        <div className="w-full h-full filter blur-[2.5px] opacity-30 dark:opacity-20 transition-all duration-500 group-hover:opacity-45 group-hover:blur-[1.5px]">
            <svg
                className="w-full h-full"
                viewBox="0 0 360 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="260" cy="95" r="90" stroke="#10b981" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
                <circle cx="260" cy="95" r="55" stroke="#059669" strokeWidth="1.5" opacity="0.6" />
                <circle cx="260" cy="95" r="25" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                <path d="M 40 190 Q 150 120 260 95 T 350 60" stroke="#10b981" strokeWidth="1.8" strokeDasharray="5 5" opacity="0.7" />
                <circle cx="40" cy="190" r="4" fill="#10b981" className="animate-pulse" />
                <circle cx="150" cy="135" r="5" fill="#f59e0b" />
                <circle cx="260" cy="95" r="6" fill="#059669" />
                <polygon points="220,55 285,30 315,65 250,90" fill="#10b981" fillOpacity="0.12" stroke="#10b981" strokeWidth="1" />
            </svg>
        </div>
    </div>
);

// 2. Simple abstract topographic & radar art for "Khám phá địa điểm nổi bật"
const LandmarksSimpleAbstract = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none [mask-image:linear-gradient(to_bottom,black_45%,transparent_92%)]">
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-emerald-500/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -left-6 w-40 h-40 bg-teal-500/20 rounded-full blur-2xl" />
        <div className="w-full h-full filter blur-[2.5px] opacity-30 dark:opacity-20 transition-all duration-500 group-hover:opacity-45 group-hover:blur-[1.5px]">
            <svg
                className="w-full h-full"
                viewBox="0 0 360 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M 50 80 C 130 45, 230 75, 300 50 C 350 90, 340 160, 290 190 C 230 220, 140 195, 80 220 Z"
                    stroke="#10b981"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    fill="#10b981"
                    fillOpacity="0.06"
                />
                <circle cx="250" cy="105" r="80" stroke="#059669" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
                <circle cx="250" cy="105" r="50" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
                <circle cx="250" cy="105" r="22" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <polygon points="250,96 258,105 250,114 242,105" fill="#10b981" className="animate-pulse" />
                <circle cx="250" cy="105" r="14" stroke="#10b981" strokeWidth="1" className="animate-ping" opacity="0.4" />
                <polygon points="150,85 156,92 150,99 144,92" fill="#f59e0b" />
                <polygon points="290,165 296,172 290,179 284,172" fill="#34d399" opacity="0.8" />
            </svg>
        </div>
    </div>
);

// 3. Simple abstract 3D spatial perspective & prism for "Công nghệ tiên tiến"
const TechSimpleAbstract = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none [mask-image:linear-gradient(to_bottom,black_45%,transparent_92%)]">
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-emerald-500/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -left-6 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl" />
        <div className="w-full h-full filter blur-[2.5px] opacity-30 dark:opacity-20 transition-all duration-500 group-hover:opacity-45 group-hover:blur-[1.5px]">
            <svg
                className="w-full h-full"
                viewBox="0 0 360 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <line x1="260" y1="75" x2="80" y2="230" stroke="#10b981" strokeWidth="0.8" opacity="0.3" />
                <line x1="260" y1="75" x2="160" y2="230" stroke="#10b981" strokeWidth="1" opacity="0.4" />
                <line x1="260" y1="75" x2="260" y2="230" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                <line x1="260" y1="75" x2="330" y2="210" stroke="#059669" strokeWidth="1" opacity="0.4" />
                <polygon points="260,35 295,18 330,35 295,52" fill="#34d399" fillOpacity="0.25" stroke="#10b981" strokeWidth="1.2" />
                <polygon points="260,35 295,52 295,90 260,73" fill="#059669" fillOpacity="0.2" stroke="#059669" strokeWidth="1" />
                <polygon points="295,52 330,35 330,73 295,90" fill="#06b6d4" fillOpacity="0.2" stroke="#06b6d4" strokeWidth="1" />
                <path d="M 120 100 Q 180 65 240 90 T 320 60" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.6" />
                <circle cx="120" cy="100" r="4" fill="#10b981" className="animate-pulse" />
                <circle cx="210" cy="75" r="4.5" fill="#f59e0b" />
                <circle cx="295" cy="52" r="3.5" fill="#06b6d4" />
            </svg>
        </div>
    </div>
);

// 4. Simple abstract 360° gyroscopic orbital & touch art for "Tương tác dễ dàng"
const InteractionSimpleAbstract = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none [mask-image:linear-gradient(to_bottom,black_45%,transparent_92%)]">
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-emerald-500/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -left-6 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl" />
        <div className="w-full h-full filter blur-[2.5px] opacity-30 dark:opacity-20 transition-all duration-500 group-hover:opacity-45 group-hover:blur-[1.5px]">
            <svg
                className="w-full h-full"
                viewBox="0 0 360 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <ellipse cx="250" cy="100" rx="80" ry="26" stroke="#10b981" strokeWidth="1.5" transform="rotate(-15 250 100)" opacity="0.65" />
                <ellipse cx="250" cy="100" rx="30" ry="75" stroke="#059669" strokeWidth="1.2" strokeDasharray="4 4" transform="rotate(25 250 100)" opacity="0.5" />
                <ellipse cx="250" cy="100" rx="70" ry="38" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5 4" transform="rotate(60 250 100)" opacity="0.45" />
                <circle cx="250" cy="100" r="18" stroke="#10b981" strokeWidth="1.5" opacity="0.4" className="animate-ping" />
                <circle cx="250" cy="100" r="36" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.55" />
                <circle cx="250" cy="100" r="5" fill="#10b981" />
                <circle cx="250" cy="100" r="2" fill="#ffffff" />
                <polygon points="250,70 253,74 250,78 247,74" fill="#10b981" />
                <polygon points="250,122 253,126 250,130 247,126" fill="#10b981" />
                <polygon points="195,100 199,97 203,100 199,103" fill="#f59e0b" />
                <polygon points="305,100 309,97 313,100 309,103" fill="#10b981" />
            </svg>
        </div>
    </div>
);

export function AboutSection() {
    const features = useMemo(() => [
        {
            iconImage: historyArchive3DIcon,
            name: "Số hóa thông tin lịch sử",
            description:
                "Toàn bộ dữ liệu về địa chỉ đỏ, nhân vật, sự kiện được số hóa, dễ dàng tra cứu và chính xác.",
            background: <HistorySimpleAbstract />,
        },
        {
            iconImage: landmarkExplore3DIcon,
            name: "Khám phá địa điểm nổi bật",
            description:
                "Dữ liệu của các địa chỉ đỏ nổi bật trong khu vực một cách chính xác và đầy đủ.",
            background: <LandmarksSimpleAbstract />,
        },
        {
            iconImage: vrAiTech3DIcon,
            name: "Công nghệ tiên tiến",
            description:
                "Ứng dụng các công nghệ Thực tế ảo (VR) và Trí tuệ nhân tạo (AI) để xây dựng giải pháp thân thiện với người dùng.",
            background: <TechSimpleAbstract />,
        },
        {
            iconImage: interaction3DIcon,
            name: "Tương tác dễ dàng",
            description:
                "Sử dụng ngay trên trình duyệt đến mọi nơi chỉ bằng click chuột.",
            background: <InteractionSimpleAbstract />,
        },
    ], []);

    return (
        <section className="py-12 sm:py-16 w-full px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient Background Lights */}
            <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full">
                {/* ================= NỀN TẢNG THỰC TẾ ẢO ================= */}
                <div>
                    {/* Header: Align Left */}
                    <div className="w-full mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground text-left">
                                <TextAnimate animation="blurIn" as="span">
                                    Nền tảng thực tế ảo
                                </TextAnimate>
                            </h2>
                            <p className="mt-2 text-base text-muted-foreground text-left font-normal max-w-2xl leading-relaxed">
                                Khám phá không gian văn hóa - lịch sử Phường Bình Long thông qua công nghệ số hóa 3D và thực tế ảo 360° tương tác đa chiều.
                            </p>
                        </div>
                    </div>

                    {/* Clean 4-Column Grid: 4 cards side-by-side on desktop, 2x2 on tablet, 1 column on mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 w-full">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-card text-card-foreground border border-border/60 shadow-md hover:shadow-xl transition-all duration-300 p-6 sm:p-7 min-h-[300px] sm:min-h-[320px]"
                            >
                                {/* Simple abstract background with soft dreamy blur */}
                                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                                    {feature.background}
                                </div>

                                {/* Content Layer */}
                                <div className="relative z-10 flex flex-col justify-between h-full pointer-events-none">
                                    <div>
                                        {/* Transparent 3D Icon */}
                                        <div className="size-20 sm:size-22 flex items-center justify-start transform-gpu transition-all duration-300 ease-in-out group-hover:scale-105 pointer-events-none -ml-2 -mt-2">
                                            <img
                                                src={feature.iconImage}
                                                alt={feature.name}
                                                className="w-full h-full object-contain filter drop-shadow-md"
                                            />
                                        </div>
                                        <h3 className="mt-4 text-lg sm:text-xl font-semibold text-foreground text-left tracking-tight">
                                            {feature.name}
                                        </h3>
                                        <p className="mt-2 text-sm text-muted-foreground font-normal leading-relaxed text-left">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Subtle hover backlight overlay */}
                                <div className="pointer-events-none absolute inset-0 z-10 transform-gpu transition-all duration-300 group-hover:bg-black/[.02] dark:group-hover:bg-white/[.02]" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
