
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { TextAnimate } from "../magicui/text-animate";
import { useMemo } from "react";
import useVRStore from "@/store/vr.store";
import { Button } from "../ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { BINHLONG_HOTSPOTS } from "@/constants/binhlong.constants";

const HotspotCard = ({
    preview_image,
    title,
    hotspot_id,
    description,
    click_panorama_id,
}: {
    preview_image: string;
    title: string;
    hotspot_id: string;
    description: string;
    click_panorama_id?: string | null;
}) => {
    const navigate = useNavigate();
    const { setIsLoading } = useVRStore((state) => state);

    const handleClick = () => {
        if (click_panorama_id) {
            navigate({
                pathname: "/app",
                search: createSearchParams({ panorama_id: click_panorama_id }).toString(),
            });
        } else {
            navigate("/app");
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };

    return (
        <figure
            onClick={handleClick}
            className={cn(
                "relative w-[310px] sm:w-[350px] min-h-[400px] cursor-pointer overflow-hidden rounded-2xl border-0 bg-card text-foreground shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group shrink-0 mx-3",
            )}
        >
            {/* Prominent Focus Image: Padded & fully rounded */}
            <div className="p-3 sm:p-3.5 pb-0 w-full">
                <div className="relative h-48 sm:h-52 w-full overflow-hidden rounded-xl bg-slate-900">
                    <img
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        alt={title}
                        src={preview_image || "/landmarks/mo_3000_nguoi.jpg"}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/landmarks/mo_3000_nguoi.jpg";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>
            </div>

            {/* Card Body */}
            <div className="p-4 sm:p-5 pt-3.5 flex-1 flex flex-col justify-between">
                <div>
                    <figcaption className="text-base sm:text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors text-left">
                        {title}
                    </figcaption>
                    <blockquote className="mt-1.5 text-xs sm:text-sm text-muted-foreground line-clamp-2 font-normal leading-relaxed text-left">
                        {description}
                    </blockquote>
                </div>

                {/* Full-width solid action button with white text and big icon on right */}
                <div className="pt-4 w-full">
                    <Button
                        className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 flex items-center justify-between shadow-xs transition-all group-hover:shadow-md cursor-pointer"
                    >
                        <span className="text-sm font-medium text-white">Xem thực tế ảo 360°</span>
                        <ArrowUpRight className="h-5 w-5 text-white stroke-[2.5]" />
                    </Button>
                </div>
            </div>
        </figure>
    );
};

export function FeatureSection() {
    const navigate = useNavigate();
    const { setIsLoading, areaHotspots } = useVRStore((state) => state);

    const hotspotsList = useMemo(() => {
        const source = areaHotspots && areaHotspots.length > 0 ? areaHotspots : BINHLONG_HOTSPOTS;
        return source.map((hotspot) => ({
            preview_image: hotspot.preview_image || "/landmarks/mo_3000_nguoi.jpg",
            title: hotspot.title || "",
            hotspot_id: String(hotspot.hotspot_id),
            description: hotspot.description || "",
            click_panorama_id: hotspot.click_panorama_id,
        }));
    }, [areaHotspots]);

    return (
        <section className="py-12 w-full px-4 sm:px-6 lg:px-8">
            <div className="w-full">
                {/* Header: Align Two Side */}
                <div className="w-full mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground text-left">
                            <TextAnimate animation="blurIn" as="span">
                                Khám phá ngay các địa điểm
                            </TextAnimate>
                        </h2>
                        <p className="mt-2 text-base text-muted-foreground text-left font-normal max-w-2xl">
                            Các địa chỉ đỏ và di tích văn hóa lịch sử tiêu biểu tại Bình Long được tái hiện sinh động qua các góc nhìn thực tế ảo 360°.
                        </p>
                    </div>

                    <Button
                        onClick={() => {
                            navigate("/app");
                            setIsLoading(true);
                            setTimeout(() => {
                                setIsLoading(false);
                            }, 2000);
                        }}
                        size="lg"
                        className="cursor-pointer rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs self-start md:self-auto shrink-0"
                    >
                        Khám phá tất cả <ArrowRight className="!h-4 !w-4 ml-1" />
                    </Button>
                </div>

                {/* Cards moving from left to right (reverse={true}) */}
                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-2">
                    <Marquee reverse pauseOnHover className="[--duration:32s] py-2">
                        {hotspotsList.map((hotspot) => (
                            <HotspotCard key={hotspot.hotspot_id} {...hotspot} />
                        ))}
                    </Marquee>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
                </div>
            </div>
        </section>
    );
}
