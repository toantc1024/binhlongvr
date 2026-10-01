
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { TextAnimate } from "../magicui/text-animate";
import { useMemo } from "react";
import useVRStore from "@/store/vr.store";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HotspotCard = ({
    preview_image,
    title,
    hotspot_id,
    description,
}: {
    preview_image: string;
    title: string;
    hotspot_id: string;
    description: string;
}) => {


    return (
        <figure
            className={cn(
                "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                // light styles
                "border-border bg-white/90 text-foreground hover:bg-secondary/60 shadow-xs transition-all",
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full object-cover" width="32" height="32" alt="" src={preview_image} />
                <div className="flex flex-col min-w-0">
                    <figcaption className="text-sm font-semibold text-foreground truncate">
                        {title}
                    </figcaption>
                    <p className="text-xs font-medium text-primary/80">{hotspot_id}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm text-muted-foreground line-clamp-2">{description}</blockquote>
        </figure>
    );
};

export function FeatureSection() {
    const navigate = useNavigate();
    const { setIsLoading } = useVRStore(state => state)
    const { areaHotspots } = useVRStore((state) => state);

    const { firstRow, secondRow } = useMemo(() => {
        const hotspots = areaHotspots.map((hotspot) => ({
            preview_image: hotspot.preview_image || '',
            title: hotspot.title || '',
            hotspot_id: String(hotspot.hotspot_id),
            description: hotspot.description || '',
        }));

        return {
            firstRow: hotspots.slice(0, Math.ceil(hotspots.length / 2)),
            secondRow: hotspots.slice(Math.ceil(hotspots.length / 2))
        };
    }, [areaHotspots]);

    return (
        <section className="pt-8 px-4 sm:pt-12 sm:px-6 md:pt-8 lg:px-32  flex w-full justify-center">
            <div className="container">
                <h2 className="py-8 text-2xl text-center font-bold md:text-4xl lg:text-5xl text-foreground">
                    <TextAnimate animation="blurIn" as="h1">
                        Khám phá ngay các địa điểm
                    </TextAnimate>
                </h2>                      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                    <Marquee pauseOnHover className="[--duration:20s]">
                        {firstRow.map((hotspot) => (
                            <HotspotCard key={hotspot.hotspot_id} {...hotspot} />
                        ))}
                    </Marquee>
                    <Marquee reverse pauseOnHover className="[--duration:20s]">
                        {secondRow.map((hotspot) => (
                            <HotspotCard key={hotspot.hotspot_id} {...hotspot} />
                        ))}
                    </Marquee>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>

                </div>

                <div className="flex justify-center pt-12 pb-24">
                    <Button onClick={() => {
                        navigate("/app")
                        setIsLoading(true);
                        setTimeout(() => {
                            setIsLoading(false);
                        }, 2000);
                    }} size="lg" className="cursor-pointer rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md">
                        Khám phá <ArrowRight className="!h-5 !w-5" />
                    </Button>
                </div>
            </div>
        </section>
    );
}
