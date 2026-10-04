import { cn } from "@/lib/utils";
import { TextAnimate } from "../magicui/text-animate";
import { useMemo, useState, useEffect } from "react";
import useVRStore from "@/store/vr.store";
import { Button } from "../ui/button";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { BINHLONG_HOTSPOTS } from "@/constants/binhlong.constants";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";

const HotspotCard = ({
    preview_image,
    title,
    hotspot_id,
    description,
    click_panorama_id,
}: {
    preview_image: string;
    title: string;
    hotspot_id?: string;
    description: string;
    click_panorama_id?: string | null;
}) => {
    const navigate = useNavigate();
    const { setIsLoading, selectHotspotAndPanorama } = useVRStore((state) => state);

    const handleClick = () => {
        const hid = hotspot_id ? Number(hotspot_id) : undefined;
        if (click_panorama_id || hid) {
            selectHotspotAndPanorama(hid, click_panorama_id || undefined);
            navigate({
                pathname: "/app",
                search: createSearchParams({
                    ...(click_panorama_id ? { panorama_id: click_panorama_id } : {}),
                    ...(hid ? { hotspot_id: String(hid) } : {}),
                }).toString(),
            });
        } else {
            navigate("/app");
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
    };

    return (
        <figure
            onClick={handleClick}
            className={cn(
                "relative w-full h-full min-h-[290px] sm:min-h-[410px] cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl border border-border/70 bg-card text-foreground shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group",
            )}
        >
            {/* Prominent Focus Image: Padded & fully rounded */}
            <div className="p-2 sm:p-3.5 pb-0 w-full">
                <div className="relative h-28 sm:h-48 md:h-52 w-full overflow-hidden rounded-lg sm:rounded-xl bg-slate-900">
                    <img
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        alt={title}
                        src={preview_image || "/landmarks/mo_3000_nguoi.jpg"}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/landmarks/mo_3000_nguoi.jpg";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />


                </div>
            </div>

            {/* Card Body */}
            <div className="p-2.5 sm:p-5 pt-2 sm:pt-3.5 flex-1 flex flex-col justify-between">
                <div>
                    <figcaption className="text-xs sm:text-base font-semibold text-foreground line-clamp-2 sm:line-clamp-1 group-hover:text-primary transition-colors text-left leading-snug sm:leading-normal">
                        {title}
                    </figcaption>
                    <blockquote className="mt-1 sm:mt-1.5 text-[11px] sm:text-sm text-muted-foreground line-clamp-2 font-normal leading-tight sm:leading-relaxed text-left">
                        {description}
                    </blockquote>
                </div>

                {/* Full-width solid action button with white text and big icon on right */}
                <div className="pt-2 sm:pt-4 w-full">
                    <Button
                        size="sm"
                        className="w-full rounded-lg sm:rounded-xl bg-primary hover:bg-primary/90 text-white font-medium py-1.5 sm:py-2.5 px-2.5 sm:px-4 flex items-center justify-between shadow-xs transition-all group-hover:shadow-md cursor-pointer h-auto sm:h-10"
                    >
                        <span className="text-[11px] sm:text-sm font-medium text-white truncate">
                            <span className="inline sm:hidden">Xem 360°</span>
                            <span className="hidden sm:inline">Xem thực tế ảo 360°</span>
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-white stroke-[2.5] shrink-0 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Button>
                </div>
            </div>
        </figure>
    );
};

export function FeatureSection() {
    const navigate = useNavigate();
    const { setIsLoading, areaHotspots } = useVRStore((state) => state);

    const [api, setApi] = useState<CarouselApi>();
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

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

    useEffect(() => {
        if (!api) return;

        const updateSelection = () => {
            setSelectedIndex(api.selectedScrollSnap());
            setCanScrollPrev(api.canScrollPrev());
            setCanScrollNext(api.canScrollNext());
        };

        const updateAll = () => {
            setScrollSnaps(api.scrollSnapList());
            updateSelection();
        };

        updateAll();
        api.on("select", updateSelection);
        api.on("reInit", updateAll);

        return () => {
            api.off("select", updateSelection);
        };
    }, [api]);

    return (
        <section className="py-12 w-full px-4 sm:px-6 lg:px-8">
            <div className="w-full">
                {/* Header: Align Two Side */}
                <div className="w-full mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground text-left">
                            <TextAnimate animation="blurIn" as="span">
                                Khám phá ngay các địa điểm
                            </TextAnimate>
                        </h2>
                        <p className="mt-2 text-sm sm:text-base text-muted-foreground text-left font-normal max-w-2xl">
                            Các địa chỉ đỏ và di tích văn hóa lịch sử tiêu biểu tại Bình Long được tái hiện sinh động qua các góc nhìn thực tế ảo 360°.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                        {/* Header Chevrons for quick navigation */}
                        <div className="flex items-center gap-1.5 mr-1 sm:mr-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => api?.scrollPrev()}
                                disabled={!canScrollPrev}
                                aria-label="Địa điểm trước"
                                className="size-8 sm:size-9 rounded-xl border border-border/80 hover:bg-secondary cursor-pointer disabled:opacity-30 active:scale-95 transition-all shadow-xs"
                            >
                                <ChevronLeft className="size-4 stroke-[2.5]" />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => api?.scrollNext()}
                                disabled={!canScrollNext}
                                aria-label="Địa điểm tiếp theo"
                                className="size-8 sm:size-9 rounded-xl border border-border/80 hover:bg-secondary cursor-pointer disabled:opacity-30 active:scale-95 transition-all shadow-xs"
                            >
                                <ChevronRight className="size-4 stroke-[2.5]" />
                            </Button>
                        </div>

                        <Button
                            onClick={() => {
                                navigate("/app");
                                setIsLoading(true);
                                setTimeout(() => {
                                    setIsLoading(false);
                                }, 300);
                            }}
                            size="lg"
                            className="cursor-pointer rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs"
                        >
                            Khám phá tất cả <ArrowRight className="!h-4 !w-4 ml-1" />
                        </Button>
                    </div>
                </div>

                {/* Carousel: 2 cards at once on mobile, with prominent chevrons */}
                <div className="relative w-full py-2">
                    <Carousel
                        setApi={setApi}
                        opts={{
                            align: "start",
                            dragFree: false,
                        }}
                        className="w-full relative"
                    >
                        <CarouselContent className="-ml-2.5 sm:-ml-4">
                            {hotspotsList.map((hotspot) => (
                                <CarouselItem
                                    key={hotspot.hotspot_id}
                                    className="basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-2.5 sm:pl-4 flex flex-col"
                                >
                                    <HotspotCard {...hotspot} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Floating Side Chevrons */}
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => api?.scrollPrev()}
                            disabled={!canScrollPrev}
                            aria-label="Địa điểm trước"
                            className={cn(
                                "absolute -left-2 sm:-left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-20",
                                "size-8 sm:size-10 rounded-full",
                                "bg-background/90 hover:bg-background text-foreground",
                                "shadow-md hover:shadow-lg border border-border/80 backdrop-blur-md",
                                "flex items-center justify-center cursor-pointer transition-all active:scale-95",
                                "disabled:opacity-20 disabled:pointer-events-none"
                            )}
                        >
                            <ChevronLeft className="size-4 sm:size-5 stroke-[2.5]" />
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => api?.scrollNext()}
                            disabled={!canScrollNext}
                            aria-label="Địa điểm tiếp theo"
                            className={cn(
                                "absolute -right-2 sm:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-20",
                                "size-8 sm:size-10 rounded-full",
                                "bg-background/90 hover:bg-background text-foreground",
                                "shadow-md hover:shadow-lg border border-border/80 backdrop-blur-md",
                                "flex items-center justify-center cursor-pointer transition-all active:scale-95",
                                "disabled:opacity-20 disabled:pointer-events-none"
                            )}
                        >
                            <ChevronRight className="size-4 sm:size-5 stroke-[2.5]" />
                        </Button>
                    </Carousel>

                    {/* Dot indicators below carousel */}
                    {scrollSnaps.length > 1 && (
                        <div className="flex items-center justify-center gap-1.5 mt-5 sm:mt-6">
                            {scrollSnaps.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => api?.scrollTo(index)}
                                    aria-label={`Trang ${index + 1}`}
                                    className={cn(
                                        "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                                        selectedIndex === index
                                            ? "w-6 bg-primary shadow-xs"
                                            : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                                    )}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
