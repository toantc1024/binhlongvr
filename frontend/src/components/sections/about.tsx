import MapBlock from "../block/MapBlock";
import { cn } from "@/lib/utils";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { AnimatedBeamMultipleInputs } from "../block/AnimatedBeamMultipleInputs";
import { Marquee } from "../magicui/marquee";
import { AnimatedListBlock } from "../block/AnimatedListBlock";
import { TextAnimate } from "../magicui/text-animate";
import useVRStore from "@/store/vr.store";
import { useMemo } from "react";

import historyArchive3DIcon from "@/assets/3d-icons/history-archive__binhlong-3d-icon.jpg";
import landmarkExplore3DIcon from "@/assets/3d-icons/landmark-explore__binhlong-3d-icon.jpg";
import vrAiTech3DIcon from "@/assets/3d-icons/vr-ai-tech__binhlong-3d-icon.jpg";
import interaction3DIcon from "@/assets/3d-icons/interaction__binhlong-3d-icon.jpg";

const DEFAULT_HISTORICAL_SITES = [
    {
        name: "Di tích Lịch sử Mộ 3.000 người An Lộc",
        body: "Nơi ghi dấu sự hy sinh anh dũng của hơn 3.000 đồng bào và chiến sĩ trong cuộc chiến đấu bảo vệ quê hương năm 1972. Di tích lịch sử - văn hóa cấp Quốc gia.",
    },
    {
        name: "Ngã Năm Thị Xã Bình Long",
        body: "Giao lộ huyết mạch lịch sử kết nối các tuyến đường trọng điểm của Bình Long, chứng nhân lịch sử qua các thời kỳ.",
    },
    {
        name: "Cổng chính Khu Di tích Mộ 3.000 người",
        body: "Cổng chính dẫn vào khuôn viên khu tưởng niệm Mộ tập thể 3.000 đồng bào An Lộc trang nghiêm và tôn kính.",
    },
    {
        name: "Cổng phụ & Cảnh quan Di tích",
        body: "Lối vào phụ và hoa viên xanh mát bao quanh khu di tích lịch sử tưởng niệm 3.000 đồng bào.",
    },
    {
        name: "Khuôn viên Nhà tưởng niệm",
        body: "Gian tưởng niệm trang nghiêm, lưu giữ các tư liệu, hình ảnh lịch sử về sự kiện Bình Long năm 1972.",
    },
];

export function AboutSection() {

    const { areaHotspots } = useVRStore(state => state)
    const files = useMemo(() => {
        if (areaHotspots && areaHotspots.length > 0) {
            return areaHotspots.map(hotspot => ({
                name: hotspot.title,
                body: hotspot.description
            }));
        }
        return DEFAULT_HISTORICAL_SITES;
    }, [areaHotspots]);

    const features = useMemo(() => [
        {
            iconImage: historyArchive3DIcon,
            name: "Số hóa thông tin lịch sử",
            description:
                "Toàn bộ dữ liệu về địa chỉ đỏ, nhân vật, sự kiện được số hóa, dễ dàng tra cứu và chính xác.",
            href: "#",
            cta: "",
            className: "col-span-3 lg:col-span-1",
            background: (
                <Marquee
                    pauseOnHover
                    className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
                >
                    {files.map((f, idx) => (
                        <figure
                            key={idx}
                            className={cn(
                                "relative w-36 cursor-pointer overflow-hidden rounded-xl border p-4",
                                "border-border bg-white/90 text-foreground hover:bg-secondary/60 shadow-xs",
                                "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
                            )}
                        >
                            <div className="flex flex-row items-center gap-2">
                                <div className="flex flex-col">
                                    <figcaption className="text-sm font-semibold text-foreground line-clamp-1">
                                        {f.name}
                                    </figcaption>
                                </div>
                            </div>
                            <blockquote className="mt-2 text-xs text-muted-foreground line-clamp-2">{f.body}</blockquote>
                        </figure>
                    ))}
                </Marquee>
            ),
        },
        {
            iconImage: landmarkExplore3DIcon,
            name: "Khám phá địa điểm nổi bật",
            description: "Dữ liệu của các địa chỉ đỏ nổi bật trong khu vực một cách chính xác và đầy đủ.",
            href: "#",
            cta: "",
            className: "col-span-3 lg:col-span-2",
            background: (
                <AnimatedListBlock className="absolute right-2 top-4 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90" />
            ),
        },
        {
            iconImage: vrAiTech3DIcon,
            name: "Công nghệ tiên tiến",
            description: "Ứng dụng các công nghệ Thực tế ảo (VR) và Trí tuệ nhân tạo (AI) để xây dựng giải pháp thân thiện với người dùng.",
            href: "#",
            cta: "",
            className: "col-span-3 lg:col-span-2",
            background: (
                <AnimatedBeamMultipleInputs className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
            ),
        },
        {
            iconImage: interaction3DIcon,
            name: "Tương tác dễ dàng",
            description: "Sử dụng ngay trên trình duyệt đến mọi nơi chỉ bằng click chuột.",
            className: "col-span-3 lg:col-span-1",
            href: "#",
            cta: "",
            background: (
                <div className="w-full h-full absolute right-0 top-10 origin-top scale-75 rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-90">

                    <MapBlock opened={false} setOpened={() => { }} showMedia={() => { }} />
                </div>
            ),
        },
    ], [files]); // <-- re-run only when `files` changes


    return (
        <section className="pt-8 px-4 sm:pt-12 sm:px-6 md:pt-8 lg:px-24 flex w-full justify-center">
            <div className="container">
                <h2 className="py-8 text-2xl text-center font-bold md:text-4xl lg:text-5xl text-foreground">
                    <TextAnimate animation="blurIn" as="h1">
                        Nền tảng thực tế ảo
                    </TextAnimate>
                </h2>
                <>
                    <BentoGrid>
                        {features.map((feature, idx) => (
                            <BentoCard key={idx} {...feature} />
                        ))}
                    </BentoGrid>
                </>
            </div>
        </section>
    );
}
