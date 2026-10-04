import { useEffect, useState } from "react";
import useVRStore from "@/store/vr.store";
import { TextAnimate } from "../magicui/text-animate";
import AnimatedNumber from "../common/AnimatedNumber";
import { countVisitorLogsByAreaId } from "@/services/visitor_logs.service";
import { CURRENT_AREA_ID } from "@/constants/env.constants";

import viewCountIcon from "@/assets/3d-icons/view-count__binhlong-3d-icon.png";
import locationIcon from "@/assets/3d-icons/location__binhlong-3d-icon.png";
import interactionIcon from "@/assets/3d-icons/interaction__binhlong-3d-icon.png";

export function StatsSection() {
  const { areaHotspots, panoramas } = useVRStore((state) => state);
  const [visitorLogsCount, setVisitorLogsCount] = useState<number>(1520);

  useEffect(() => {
    let mounted = true;
    countVisitorLogsByAreaId(CURRENT_AREA_ID)
      .then((realCount) => {
        if (mounted && realCount > 0) {
          setVisitorLogsCount(1520 + realCount);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const totalVisitorLogs = visitorLogsCount;
  const totalHotspots = areaHotspots?.length || 5;
  const totalPanoramas = panoramas?.length || 20;

  const statsList = [
    {
      value: totalVisitorLogs,
      suffix: "+",
      label: "lượt xem",
      description: "đã được thực hiện trong khu vực.",
      icon: viewCountIcon,
    },
    {
      value: totalHotspots,
      suffix: "",
      label: "địa điểm",
      description: "đã được cập nhật lên hệ thống.",
      icon: locationIcon,
    },
    {
      value: totalPanoramas,
      suffix: "",
      label: "điểm nhìn",
      description: "đã được số hóa thành công trong các địa điểm.",
      icon: interactionIcon,
    },
  ];

  return (
    <section className="py-12 w-full px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        {/* Header: Align Two Side */}
        <div className="w-full mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground text-left">
              <TextAnimate animation="blurIn" as="span">
                Những con số biết nói
              </TextAnimate>
            </h2>
            <p className="mt-2 text-base text-muted-foreground text-left font-normal max-w-2xl">
              Thống kê tổng quan dữ liệu số hóa và tương tác trực tuyến trên hệ thống bản đồ số Phường Bình Long.
            </p>
          </div>
        </div>

        {/* 3 Symmetrical Stat Cards: Align Two Side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {statsList.map((stat, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-xl border-0 shadow-md bg-card p-6 sm:p-7 flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-4xl sm:text-5xl font-semibold text-foreground tracking-tight">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} formatStyle="en" />
                  </span>
                  <p className="mt-3 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                    {stat.label}
                  </p>
                </div>

                {/* Transparent 3D Asset: No border, no background shadow */}
                <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center -mr-2 -mt-2 pointer-events-none">
                  <img
                    src={stat.icon}
                    alt={stat.label}
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground font-normal leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
