import { TextAnimate } from "../magicui/text-animate";
import { useMemo, useState } from "react";
import { Maximize2, ChevronLeft, ChevronRight, X } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { Badge } from "@/components/ui/badge";

import historyArchive3DIcon from "@/assets/3d-icons/history-archive__binhlong-3d-icon.png";
import landmarkExplore3DIcon from "@/assets/3d-icons/landmark-explore__binhlong-3d-icon.png";
import vrAiTech3DIcon from "@/assets/3d-icons/vr-ai-tech__binhlong-3d-icon.png";
import interaction3DIcon from "@/assets/3d-icons/interaction__binhlong-3d-icon.png";

// Authentic photos of Phường Bình Long
const BINHLONG_SHOWCASE_PHOTOS = [
    {
        id: "tru_so",
        title: "Trụ sở Đảng bộ – HĐND – UBND Phường Bình Long",
        subtitle: "Cổng chào Đại hội Đại biểu Đảng bộ Phường Bình Long lần thứ I, nhiệm kỳ 2025 – 2030",
        description:
            "Trụ sở làm việc của Đảng bộ và chính quyền Phường Bình Long được trang hoàng trang trọng, rực rỡ cờ hoa, pano khẩu hiệu nhân dịp Đại hội đại biểu khóa I.",
        tag: "Trụ sở Hành chính",
        image: "/images/phuong_binh_long/phuong_binh_long_tru_so_cong_chao.jpg",
    },
    {
        id: "dieu_hanh",
        title: "Đoàn xe diễu hành chào mừng Đại hội",
        subtitle: "Khí thế hân hoan, rực rỡ cờ hoa trên các trục lộ giao thông chính",
        description:
            "Đoàn xe hoa và lực lượng tuần hành rực rỡ cờ đỏ búa liềm và cờ Tổ quốc diễu hành trên tuyến đại lộ rợp bóng cây xanh của Phường Bình Long.",
        tag: "Sự kiện lịch sử",
        image: "/images/phuong_binh_long/phuong_binh_long_dieu_hanh.jpg",
    },
    {
        id: "tuyen_pho",
        title: "Tuyến phố trung tâm & Cụm biểu tượng Hoa Sen",
        subtitle: "Không gian đô thị khang trang, năng động và phát triển",
        description:
            "Tuyến đường thương mại trung tâm sầm uất với điểm nhấn cụm biểu tượng đóa sen Bình Long vươn cao kiêu hãnh, biểu trưng cho sức sống và sự vươn lên.",
        tag: "Đô thị trung tâm",
        image: "/images/phuong_binh_long/phuong_binh_long_tuyen_pho_hoa_sen.jpg",
    },
    {
        id: "duong_co_hoa",
        title: "Đại lộ rợp bóng cây xanh & cờ đỏ sao vàng",
        subtitle: "Cảnh quan thanh bình, tươi đẹp rợp bóng mát",
        description:
            "Tuyến đường rợp bóng cây cổ thụ xanh mát hòa cùng sắc đỏ thắm tươi của cờ Tổ quốc và cờ Đảng chào đón những ngày hội non sông.",
        tag: "Cảnh quan đô thị",
        image: "/images/phuong_binh_long/phuong_binh_long_duong_co_hoa.jpg",
    },
    {
        id: "giao_lo",
        title: "Giao lộ kết nối Quốc lộ 13 huyết mạch",
        subtitle: "Hạ tầng giao thông thông thoáng hướng về Cửa khẩu Hoa Lư",
        description:
            "Điểm nút giao thông chiến lược nằm trên trục Quốc lộ 13 – tuyến huyết mạch nối liền TP. Hồ Chí Minh với Cửa khẩu Quốc tế Hoa Lư và Campuchia.",
        tag: "Hạ tầng giao thông",
        image: "/images/phuong_binh_long/phuong_binh_long_giao_lo_trung_tam.jpg",
    },
];

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
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

    const lightboxSlides = useMemo(
        () =>
            BINHLONG_SHOWCASE_PHOTOS.map((photo) => ({
                src: photo.image,
                title: photo.title,
                subtitle: photo.subtitle,
                description: photo.description,
                tag: photo.tag,
            })),
        []
    );

    return (
        <section className="py-12 sm:py-16 w-full px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient Background Lights */}
            <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full space-y-16">
                {/* ================= PART 1: NỀN TẢNG THỰC TẾ ẢO ================= */}
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

                {/* ================= PART 2: HÌNH ẢNH & DẤU ẤN PHƯỜNG BÌNH LONG ================= */}
                <div className="pt-6">
                    <div className="w-full mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground text-left">
                                <TextAnimate animation="blurIn" as="span">
                                    Dấu Ấn Đổi Mới
                                </TextAnimate>{" "}
                                <span className="text-primary font-semibold">Phường Bình Long</span>
                            </h2>
                            <p className="mt-2 text-base text-muted-foreground text-left font-normal max-w-3xl leading-relaxed">
                                Ghi nhận những hình ảnh chân thực, diện mạo đô thị khang trang và các sự kiện chính trị – văn hóa trọng đại của Đảng bộ và Nhân dân Phường Bình Long.
                            </p>
                        </div>
                    </div>

                    {/* Responsive Bento Grid with 5 Real Photos */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6">
                        {/* Top Row: 2 Major Feature Cards (6-6 cols on desktop) */}
                        {BINHLONG_SHOWCASE_PHOTOS.slice(0, 2).map((photo, idx) => (
                            <div
                                key={photo.id}
                                onClick={() => setLightboxIndex(idx)}
                                className="group relative md:col-span-6 h-[280px] sm:h-[340px] rounded-2xl overflow-hidden cursor-pointer border border-border/60 hover:border-primary/50 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-end"
                            >
                                <img
                                    src={photo.image}
                                    alt={photo.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 pointer-events-none" />

                                {/* Top Floating Badges */}
                                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                                    <Badge className="bg-emerald-600/90 hover:bg-emerald-600 text-white border-0 text-xs font-semibold backdrop-blur-md shadow-md">
                                        {photo.tag}
                                    </Badge>
                                    <div className="w-8 h-8 rounded-lg bg-black/50 text-white backdrop-blur-md flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                                        <Maximize2 className="w-4 h-4" />
                                    </div>
                                </div>

                                {/* Bottom Content Overlay */}
                                <div className="relative z-10 p-5 sm:p-6 text-white pointer-events-none">
                                    <h3 className="text-lg sm:text-xl font-bold leading-snug drop-shadow-md text-white group-hover:text-emerald-300 transition-colors">
                                        {photo.title}
                                    </h3>
                                </div>
                            </div>
                        ))}

                        {/* Bottom Row: 3 Feature Cards (4-4-4 cols on desktop) */}
                        {BINHLONG_SHOWCASE_PHOTOS.slice(2, 5).map((photo, idx) => (
                            <div
                                key={photo.id}
                                onClick={() => setLightboxIndex(idx + 2)}
                                className="group relative md:col-span-4 h-[240px] sm:h-[280px] rounded-2xl overflow-hidden cursor-pointer border border-border/60 hover:border-primary/50 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-end"
                            >
                                <img
                                    src={photo.image}
                                    alt={photo.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none" />

                                {/* Top Floating Badges */}
                                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
                                    <Badge className="bg-emerald-600/90 hover:bg-emerald-600 text-white border-0 text-[11px] font-semibold backdrop-blur-md shadow-md">
                                        {photo.tag}
                                    </Badge>
                                    <div className="w-7 h-7 rounded-lg bg-black/50 text-white backdrop-blur-md flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                                        <Maximize2 className="w-3.5 h-3.5" />
                                    </div>
                                </div>

                                {/* Bottom Content Overlay */}
                                <div className="relative z-10 p-4 sm:p-5 text-white pointer-events-none">
                                    <h3 className="text-base sm:text-lg font-bold leading-snug drop-shadow-md text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                                        {photo.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= HIGH-RES LIGHTBOX WITH FULL-WIDTH & DRAG LEFT/RIGHT ================= */}
            <Lightbox
                open={lightboxIndex !== null}
                close={() => setLightboxIndex(null)}
                index={lightboxIndex ?? 0}
                slides={lightboxSlides}
                plugins={[Zoom, Counter]}
                carousel={{ finite: false }}
                animation={{ swipe: 300 }}
                render={{
                    iconPrev: () => (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/65 hover:bg-emerald-600 text-white border border-white/25 shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer select-none">
                            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 stroke-[2.5]" />
                        </div>
                    ),
                    iconNext: () => (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/65 hover:bg-emerald-600 text-white border border-white/25 shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer select-none">
                            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 stroke-[2.5]" />
                        </div>
                    ),
                    iconClose: () => (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/65 hover:bg-red-600 text-white border border-white/25 shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer select-none">
                            <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                        </div>
                    ),
                    slideFooter: ({ slide }: any) => (
                        <div className="absolute bottom-0 inset-x-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent pt-16 sm:pt-24 pb-6 sm:pb-8 px-5 sm:px-10 lg:px-16 text-white z-50 pointer-events-auto select-none">
                            <div className="w-full space-y-1.5 text-left">
                                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug drop-shadow-lg">
                                    {slide.title}
                                </h3>
                                {slide.subtitle && (
                                    <p className="text-sm sm:text-base lg:text-lg font-medium text-emerald-400 drop-shadow-sm leading-relaxed">
                                        {slide.subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    ),
                }}
            />
        </section>
    );
}
