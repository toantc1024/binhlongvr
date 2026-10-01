import useVRStore from "@/store/vr.store";
import { NumberTicker } from "@/components/magicui/number-ticket";
import { TextAnimate } from "../magicui/text-animate";
import GradientCardBlock from "../block/GradientCardBlock";

export function StatsSection() {
  const { areaHotspots, panoramas } = useVRStore((state) => state);

  const totalVisitorLogs = 1520;
  const totalHotspots = areaHotspots?.length || 5;
  const totalPanoramas = panoramas?.length || 20;

  return (
    <section className="pt-8 px-4 sm:pt-12 sm:px-6 md:pt-8 lg:px-24 flex w-full justify-center">
      <div className="container">
        <h2 className="py-8 text-2xl text-center font-bold md:text-4xl lg:text-5xl text-foreground">
          <TextAnimate animation="blurIn" as="h1">
            Những con số biết nói
          </TextAnimate>
        </h2>

        <div className="mt-4 sm:mt-8 grid sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-5 justify-center">
          <GradientCardBlock className="!p-4 col-span-2">
            <span className="text-5xl md:text-6xl font-bold text-foreground">
              <NumberTicker value={totalVisitorLogs} />+
            </span>
            <p className="mt-6 font-semibold text-xl text-foreground">
              lượt xem
            </p>
            <p className="mt-2 text-[17px] text-muted-foreground">
              đã được thực hiện trong khu vực.
            </p>
          </GradientCardBlock>

          <GradientCardBlock className="!p-4 col-span-1 !bg-primary/5 border-primary/20">
            <span className="text-5xl md:text-6xl font-bold text-foreground">
              <NumberTicker value={totalHotspots} />
            </span>
            <p className="mt-6 font-semibold text-xl text-foreground">
              địa điểm
            </p>
            <p className="mt-2 text-[17px] text-muted-foreground">
              đã được cập nhật lên hệ thống.
            </p>
          </GradientCardBlock>

          <GradientCardBlock className="!p-4 col-span-1">
            <span className="text-5xl md:text-6xl font-bold text-foreground">
              <NumberTicker value={totalPanoramas} />
            </span>
            <p className="mt-6 font-semibold text-xl text-foreground">
              điểm nhìn
            </p>
            <p className="mt-2 text-[17px] text-muted-foreground">
              đã được số hóa thành công trong các địa điểm.
            </p>
          </GradientCardBlock>
        </div>
      </div>
    </section>
  );
}
