import type { Hotspot } from "@/types/hotspots.service.type";
import {
  ArrowUpRight,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Image,
  Info,
  MapPin,
} from "lucide-react";
import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import useVRStore from "@/store/vr.store";

const formatFileSize = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
};

const HotspotInfoBlock = ({ hotspot }: { hotspot: Hotspot | null }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  const { panoramas } = useVRStore((state) => state);

  if (!hotspot) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 p-2 gap-4">
      <div className="col-span-1 space-y-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-foreground text-2xl sm:text-3xl lg:text-4xl">
            {hotspot.title}
          </h2>
          <a className="flex items-center gap-2 text-primary hover:underline text-sm font-medium transition-colors pt-2 lg:pt-4 cursor-pointer">
            <MapPin className="w-4 h-4 flex-shrink-0 text-primary" />
            <span className="truncate">{hotspot.address}</span>
          </a>
        </div>

        <div className="p-2 rounded-3xl shadow-xs">
          <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-foreground">
            <Image className="w-5 h-5 flex-shrink-0 text-foreground" />
            Thư viện ảnh
          </h2>
          <div className="max-w-full py-4">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {[{ preview_image: hotspot.preview_image }, ...panoramas]
                  .filter((panorama) => panorama.preview_image)
                  .map((panorama, index) => (
                    <CarouselItem key={index}>
                      <Card className="!p-0 border border-border bg-transparent rounded-2xl sm:rounded-3xl shadow-xs">
                        <CardContent
                          className="flex rounded-2xl sm:rounded-3xl aspect-video items-center justify-center"
                          style={{
                            backgroundImage: `url(${panorama.preview_image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }}
                        ></CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious className="bg-white/95 hover:bg-secondary border border-border text-foreground top-[calc(100%+0.5rem)] translate-y-0 left-0 w-8 h-8 sm:w-10 sm:h-10 cursor-pointer shadow-xs" />
              <CarouselNext className="bg-white/95 hover:bg-secondary border border-border text-foreground top-[calc(100%+0.5rem)] translate-y-0 left-10 sm:left-12 translate-x-0 w-8 h-8 sm:w-10 sm:h-10 cursor-pointer shadow-xs" />
            </Carousel>
            <div className="mt-4 flex items-center justify-center sm:justify-end gap-2">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border-2 border-border transition-all",
                    {
                      "border-primary bg-primary": current === index + 1,
                    }
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-1 space-y-4">
        <div className="bg-secondary/70 border border-border p-3 sm:p-4 rounded-2xl shadow-xs">
          <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-foreground">
            <Info className="w-5 h-5 flex-shrink-0 text-foreground" />
            Giới thiệu{" "}
          </h2>
          <div className="max-w-full text-muted-foreground py-2">
            <p className="text-sm sm:text-base leading-relaxed font-normal">{hotspot.description}</p>
          </div>
        </div>
        <div
          onClick={() => window.open(hotspot.website || "", "_blank")}
          className="bg-secondary/70 hover:bg-secondary border border-border transition-colors cursor-pointer p-3 sm:p-4 rounded-2xl shadow-xs relative"
        >
          <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-foreground">
            Truy cập Website{" "}
          </h2>
          <div className="absolute top-0 right-0 p-3 sm:p-4 text-foreground">
            <ArrowUpRight className="w-5 h-5 text-foreground" />
          </div>
          <div className="max-w-full text-primary py-2 pr-8 font-medium">
            <p className="text-sm sm:text-base break-all hover:underline">{hotspot.website}</p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 max-h-[350px] sm:max-h-[400px] overflow-auto">
          {hotspot.documents &&
          Array.isArray(hotspot.documents) &&
          hotspot.documents.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {hotspot.documents.map((doc: any, index: number) => (
                <div
                  key={doc.id || index}
                  className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-border shadow-xs"
                >
                  <div className="space-y-3">
                    {/* Document Header */}
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                      <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border bg-secondary border-border flex-shrink-0">
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-foreground font-bold text-xs sm:text-sm mb-1 truncate">
                            {doc.title || doc.file_name}
                          </h4>
                          <p className="text-muted-foreground text-xs mb-1">
                            <span className="truncate block sm:inline">
                              {doc.file_name}
                            </span>
                            <span className="hidden sm:inline"> • </span>
                            <span className="block sm:inline">
                              {doc.file_size
                                ? formatFileSize(doc.file_size)
                                : "Không rõ dung lượng"}
                            </span>
                          </p>
                          {doc.created_at && (
                            <p className="text-muted-foreground/70 text-xs">
                              {new Date(doc.created_at).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                        {doc.url && (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border bg-secondary border-border hover:bg-secondary/80 transition-all text-foreground"
                            title="Tải xuống"
                          >
                            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Document Preview - Only for PDFs */}
                    {doc.url && doc.file_type === "application/pdf" && (
                      <div className="mt-3 sm:mt-4">
                        <div className="border border-border rounded-lg overflow-hidden bg-white">
                          <iframe
                            src={`${doc.url}#toolbar=0&navpanes=0&scrollbar=0`}
                            className="w-full h-48 sm:h-64"
                            title={`Preview of ${doc.title || doc.file_name}`}
                            loading="lazy"
                            onError={() => {
                              // Handle iframe error silently
                            }}
                          />
                        </div>
                        <div className="mt-2 text-center">
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 sm:gap-2 text-primary hover:underline text-xs sm:text-sm font-medium transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                            Xem toàn màn hình
                            <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-secondary/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-border text-center">
              <div className="flex flex-col items-center gap-2 sm:gap-3 py-6 sm:py-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border bg-secondary border-border text-foreground">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                </div>
                <p className="text-foreground font-medium text-xs sm:text-sm">
                  Chưa có tài liệu nào
                </p>
                <p className="text-muted-foreground text-xs">
                  Các tài liệu liên quan sẽ được hiển thị ở đây
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotspotInfoBlock;
