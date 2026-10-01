import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { TextAnimate } from "../magicui/text-animate";
import { useMemo } from "react";

import historyArchive3DIcon from "@/assets/3d-icons/history-archive__binhlong-3d-icon.png";
import landmarkExplore3DIcon from "@/assets/3d-icons/landmark-explore__binhlong-3d-icon.png";
import vrAiTech3DIcon from "@/assets/3d-icons/vr-ai-tech__binhlong-3d-icon.png";
import interaction3DIcon from "@/assets/3d-icons/interaction__binhlong-3d-icon.png";

// 1. Abstract geometric digital archive art for "Số hóa thông tin lịch sử"
const HistoryAbstractArt = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none [mask-image:linear-gradient(to_bottom,black_65%,transparent_98%)]">
        {/* Soft glowing ambient blur orbs */}
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-emerald-500/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-8 w-44 h-44 bg-amber-500/15 rounded-full blur-2xl" />

        {/* Abstract vector constellation & orbital rings */}
        <svg
            className="w-full h-full opacity-80 dark:opacity-45"
            viewBox="0 0 400 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="histEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="histAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0.15" />
                </linearGradient>
            </defs>

            {/* Concentric orbital rings */}
            <circle cx="280" cy="110" r="105" stroke="#10b981" strokeWidth="1" strokeDasharray="4 6" opacity="0.45" />
            <circle cx="280" cy="110" r="70" stroke="url(#histEmeraldGrad)" strokeWidth="1.5" opacity="0.65" />
            <circle cx="280" cy="110" r="35" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 4" opacity="0.55" />

            {/* Timeline nodes & interconnected curves */}
            <path
                d="M 50 215 Q 150 140 280 110 T 385 70"
                stroke="url(#histEmeraldGrad)"
                strokeWidth="2"
                strokeDasharray="6 6"
            />
            <path
                d="M 100 245 Q 195 190 280 110"
                stroke="#059669"
                strokeWidth="1.2"
                opacity="0.5"
            />

            {/* Glowing nodes */}
            <circle cx="50" cy="215" r="4.5" fill="#10b981" className="animate-pulse" />
            <circle cx="150" cy="155" r="5.5" fill="#f59e0b" />
            <circle cx="210" cy="190" r="3.5" fill="#10b981" />
            <circle cx="280" cy="110" r="6.5" fill="#059669" />
            <circle cx="345" cy="85" r="3.5" fill="#10b981" opacity="0.75" />

            {/* Isometric abstract layer tablets */}
            <polygon
                points="240,65 315,35 345,75 270,105"
                fill="url(#histEmeraldGrad)"
                stroke="#10b981"
                strokeWidth="1"
                opacity="0.4"
            />
            <polygon
                points="240,82 315,52 345,92 270,122"
                fill="url(#histEmeraldGrad)"
                stroke="#059669"
                strokeWidth="0.8"
                opacity="0.25"
            />
        </svg>
    </div>
);

// 2. Pure abstract topographic & radar art for "Khám phá địa điểm nổi bật"
const LandmarksAbstractArt = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none [mask-image:linear-gradient(to_bottom,black_65%,transparent_98%)]">
        {/* Soft glowing ambient blur orbs */}
        <div className="absolute -top-12 -right-8 w-72 h-72 bg-emerald-500/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-1/3 w-56 h-56 bg-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-44 h-44 bg-amber-500/15 rounded-full blur-2xl" />

        {/* Abstract topographic curves & radar orbits */}
        <svg
            className="w-full h-full opacity-80 dark:opacity-45"
            viewBox="0 0 520 320"
            preserveAspectRatio="xMaxYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="landEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#047857" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="landAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0.15" />
                </linearGradient>
                <linearGradient id="contourGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.02" />
                </linearGradient>
            </defs>

            {/* Smooth flowing topographic contour curves */}
            <path
                d="M 60 80 C 160 40, 290 80, 400 45 C 470 95, 460 175, 400 210 C 330 250, 230 220, 150 250 C 70 280, 40 200, 60 130 Z"
                stroke="#10b981"
                strokeWidth="1.2"
                strokeDasharray="5 5"
                fill="url(#contourGrad)"
            />
            <path
                d="M 120 105 C 190 75, 300 100, 360 125 C 340 185, 290 175, 240 205 C 180 220, 130 180, 140 135 Z"
                stroke="#059669"
                strokeWidth="1.5"
                fill="url(#contourGrad)"
            />
            <path
                d="M 180 120 C 240 105, 310 125, 300 160 C 270 185, 215 175, 200 145 Z"
                stroke="#34d399"
                strokeWidth="1"
                opacity="0.5"
            />

            {/* Concentric radar beacon rings */}
            <circle cx="340" cy="130" r="125" stroke="#10b981" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
            <circle cx="340" cy="130" r="80" stroke="url(#landEmeraldGrad)" strokeWidth="1.5" opacity="0.65" />
            <circle cx="340" cy="130" r="42" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

            {/* Delicate radar angle beam */}
            <line x1="340" y1="130" x2="445" y2="55" stroke="url(#landAmberGrad)" strokeWidth="1.5" strokeDasharray="4 2" />

            {/* Geodesic dashed curves */}
            <path
                d="M 180 115 Q 260 80 340 130 T 435 195"
                stroke="url(#landEmeraldGrad)"
                strokeWidth="1.8"
                strokeDasharray="6 4"
            />
            <path
                d="M 230 205 Q 290 160 340 130"
                stroke="#059669"
                strokeWidth="1.2"
                opacity="0.5"
            />

            {/* Glowing landmark waypoint diamond nodes */}
            <polygon points="340,118 350,130 340,142 330,130" fill="#10b981" className="animate-pulse" />
            <circle cx="340" cy="130" r="16" stroke="#10b981" strokeWidth="1" className="animate-ping" opacity="0.4" />

            <polygon points="215,95 223,105 215,115 207,105" fill="#f59e0b" />
            <circle cx="215" cy="105" r="7" stroke="#f59e0b" strokeWidth="0.8" opacity="0.4" />

            <polygon points="425,185 433,195 425,205 417,195" fill="#10b981" />
            <polygon points="160,215 167,224 160,233 153,224" fill="#34d399" opacity="0.75" />

            {/* Simple abstract crosshairs */}
            <path d="M 270 45 L 270 55 M 265 50 L 275 50" stroke="#10b981" strokeWidth="1" opacity="0.45" />
            <path d="M 430 75 L 430 85 M 425 80 L 435 80" stroke="#f59e0b" strokeWidth="1" opacity="0.55" />
        </svg>
    </div>
);

// 3. Pure abstract 3D spatial & neural art for "Công nghệ tiên tiến"
const TechAbstractArt = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none [mask-image:linear-gradient(to_bottom,black_65%,transparent_98%)]">
        {/* Soft glowing ambient blur orbs */}
        <div className="absolute -top-10 -right-8 w-72 h-72 bg-emerald-500/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-44 h-44 bg-teal-500/15 rounded-full blur-2xl" />

        {/* Abstract 3D perspective & neural synapses */}
        <svg
            className="w-full h-full opacity-80 dark:opacity-45"
            viewBox="0 0 520 320"
            preserveAspectRatio="xMaxYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="techEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="techCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.15" />
                </linearGradient>
                <linearGradient id="prismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
                </linearGradient>
            </defs>

            {/* Spatial perspective wireframe rays */}
            <line x1="360" y1="85" x2="100" y2="280" stroke="#10b981" strokeWidth="0.8" opacity="0.25" />
            <line x1="360" y1="85" x2="190" y2="280" stroke="#10b981" strokeWidth="1" opacity="0.3" />
            <line x1="360" y1="85" x2="280" y2="280" stroke="url(#techEmeraldGrad)" strokeWidth="1.2" opacity="0.45" />
            <line x1="360" y1="85" x2="360" y2="280" stroke="#10b981" strokeWidth="1" strokeDasharray="3 4" opacity="0.35" />
            <line x1="360" y1="85" x2="450" y2="280" stroke="url(#techEmeraldGrad)" strokeWidth="1.2" opacity="0.45" />

            {/* Curved spatial depth arcs */}
            <path d="M 160 220 Q 360 180 480 220" stroke="#059669" strokeWidth="1.2" strokeDasharray="4 5" opacity="0.35" />
            <path d="M 230 160 Q 360 135 440 160" stroke="#10b981" strokeWidth="1.2" opacity="0.35" />

            {/* Floating 3D holographic isometric crystal */}
            <polygon
                points="360,40 400,20 440,40 400,60"
                fill="url(#prismGrad)"
                stroke="#10b981"
                strokeWidth="1.2"
                opacity="0.5"
            />
            <polygon
                points="360,40 400,60 400,105 360,85"
                fill="url(#techEmeraldGrad)"
                stroke="#059669"
                strokeWidth="1"
                opacity="0.3"
            />
            <polygon
                points="400,60 440,40 440,85 400,105"
                fill="url(#techCyanGrad)"
                stroke="#06b6d4"
                strokeWidth="1"
                opacity="0.25"
            />

            {/* Neural network synaptic arcs */}
            <path
                d="M 170 115 Q 240 70 300 100 T 400 60 T 470 95"
                stroke="url(#techEmeraldGrad)"
                strokeWidth="1.8"
                strokeDasharray="5 5"
            />
            <path
                d="M 240 170 Q 310 130 380 160"
                stroke="url(#techCyanGrad)"
                strokeWidth="1.2"
                opacity="0.6"
            />

            {/* Synaptic nodes */}
            <circle cx="170" cy="115" r="4" fill="#10b981" className="animate-pulse" />
            <circle cx="250" cy="75" r="5" fill="#f59e0b" />
            <circle cx="310" cy="105" r="4.5" fill="#10b981" />
            <circle cx="240" cy="170" r="3.5" fill="#34d399" />
            <circle cx="380" cy="160" r="4" fill="#06b6d4" />
            <circle cx="470" cy="95" r="4" fill="#f59e0b" opacity="0.75" />

            {/* Hexagonal holographic node */}
            <polygon
                points="310,95 320,100 320,110 310,115 300,110 300,100"
                stroke="#10b981"
                strokeWidth="1.2"
                fill="url(#prismGrad)"
                opacity="0.6"
            />
        </svg>
    </div>
);

// 4. Pure abstract 360° orbital & interactive touch art for "Tương tác dễ dàng"
const InteractionAbstractArt = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none [mask-image:linear-gradient(to_bottom,black_65%,transparent_98%)]">
        {/* Soft glowing ambient blur orbs */}
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-emerald-500/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-8 w-44 h-44 bg-amber-500/15 rounded-full blur-2xl" />

        {/* Abstract 360° gyroscopic orbits & touch ripple waves */}
        <svg
            className="w-full h-full opacity-80 dark:opacity-45"
            viewBox="0 0 400 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="interactEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="interactAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0.15" />
                </linearGradient>
            </defs>

            {/* 360° Gyroscopic 3-axis rotation rings */}
            <ellipse
                cx="270"
                cy="115"
                rx="95"
                ry="30"
                stroke="url(#interactEmeraldGrad)"
                strokeWidth="1.5"
                transform="rotate(-15 270 115)"
            />
            <ellipse
                cx="270"
                cy="115"
                rx="35"
                ry="88"
                stroke="#10b981"
                strokeWidth="1.2"
                strokeDasharray="4 5"
                transform="rotate(25 270 115)"
                opacity="0.55"
            />
            <ellipse
                cx="270"
                cy="115"
                rx="82"
                ry="44"
                stroke="url(#interactAmberGrad)"
                strokeWidth="1"
                strokeDasharray="5 5"
                transform="rotate(60 270 115)"
                opacity="0.5"
            />

            {/* Concentric touch ripple pulses */}
            <circle cx="270" cy="115" r="20" stroke="#10b981" strokeWidth="1.5" opacity="0.4" className="animate-ping" />
            <circle cx="270" cy="115" r="42" stroke="url(#interactEmeraldGrad)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.55" />
            <circle cx="270" cy="115" r="68" stroke="#059669" strokeWidth="1" opacity="0.35" />

            {/* Central glowing touch pivot point */}
            <circle cx="270" cy="115" r="6" fill="#10b981" />
            <circle cx="270" cy="115" r="2.5" fill="#ffffff" />

            {/* 4-way cardinal direction diamonds */}
            <polygon points="270,80 274,85 270,90 266,85" fill="#10b981" />
            <polygon points="270,140 274,145 270,150 266,145" fill="#10b981" />
            <polygon points="210,115 215,111 220,115 215,119" fill="#f59e0b" />
            <polygon points="325,115 330,111 335,115 330,119" fill="#10b981" />

            {/* Gesture curved arrow arc */}
            <path d="M 330 95 A 70 26 0 0 1 342 125" stroke="#34d399" strokeWidth="2" fill="none" opacity="0.75" />

            {/* Subtle micro dots */}
            <circle cx="160" cy="170" r="3" fill="#10b981" className="animate-pulse" />
            <circle cx="110" cy="130" r="2.5" fill="#f59e0b" opacity="0.6" />
        </svg>
    </div>
);

export function AboutSection() {
    const features = useMemo(() => [
        {
            iconImage: historyArchive3DIcon,
            name: "Số hóa thông tin lịch sử",
            description:
                "Toàn bộ dữ liệu về địa chỉ đỏ, nhân vật, sự kiện được số hóa, dễ dàng tra cứu và chính xác.",
            href: "#",
            cta: "",
            className: "col-span-1 md:col-span-1 lg:col-span-1 min-h-[340px] sm:min-h-[350px] lg:min-h-0",
            background: <HistoryAbstractArt />,
        },
        {
            iconImage: landmarkExplore3DIcon,
            name: "Khám phá địa điểm nổi bật",
            description: "Dữ liệu của các địa chỉ đỏ nổi bật trong khu vực một cách chính xác và đầy đủ.",
            href: "#",
            cta: "",
            className: "col-span-1 md:col-span-2 lg:col-span-2 min-h-[340px] sm:min-h-[350px] lg:min-h-0",
            background: <LandmarksAbstractArt />,
        },
        {
            iconImage: vrAiTech3DIcon,
            name: "Công nghệ tiên tiến",
            description: "Ứng dụng các công nghệ Thực tế ảo (VR) và Trí tuệ nhân tạo (AI) để xây dựng giải pháp thân thiện với người dùng.",
            href: "#",
            cta: "",
            className: "col-span-1 md:col-span-2 lg:col-span-2 min-h-[340px] sm:min-h-[350px] lg:min-h-0",
            background: <TechAbstractArt />,
        },
        {
            iconImage: interaction3DIcon,
            name: "Tương tác dễ dàng",
            description: "Sử dụng ngay trên trình duyệt đến mọi nơi chỉ bằng click chuột.",
            className: "col-span-1 md:col-span-1 lg:col-span-1 min-h-[340px] sm:min-h-[350px] lg:min-h-0",
            href: "#",
            cta: "",
            background: <InteractionAbstractArt />,
        },
    ], []);

    return (
        <section className="py-12 w-full px-4 sm:px-6 lg:px-8">
            <div className="w-full">
                <div className="w-full mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground text-left">
                            <TextAnimate animation="blurIn" as="span">
                                Nền tảng thực tế ảo
                            </TextAnimate>
                        </h2>
                        <p className="mt-2 text-base text-muted-foreground text-left font-normal max-w-2xl">
                            Khám phá không gian văn hóa - lịch sử Bình Long thông qua công nghệ số hóa 3D và thực tế ảo 360° tương tác đa chiều.
                        </p>
                    </div>
                </div>

                <BentoGrid className="w-full">
                    {features.map((feature, idx) => (
                        <BentoCard key={idx} {...feature} />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
}
