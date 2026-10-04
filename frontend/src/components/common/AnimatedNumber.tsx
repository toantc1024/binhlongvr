import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  padZero?: boolean;
  formatStyle?: "vi" | "en";
  duration?: number;
  className?: string;
}

export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  padZero = false,
  formatStyle = "vi",
  duration = 1500,
  className,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTimestamp: number | null = null;

          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // smooth easeOutExpo
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setDisplayValue(ease * value);

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setDisplayValue(value);
            }
          };

          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [value, duration]);

  let formatted = "";
  if (decimals > 0) {
    const fixed = displayValue.toFixed(decimals);
    formatted = formatStyle === "vi" ? fixed.replace(".", ",") : fixed;
  } else {
    const rounded = Math.floor(displayValue);
    if (padZero && rounded < 10) {
      formatted = `0${rounded}`;
    } else {
      formatted =
        formatStyle === "vi"
          ? rounded.toLocaleString("vi-VN")
          : rounded.toLocaleString("en-US");
    }
  }

  return (
    <span ref={elementRef} className={className ?? "tabular-nums tracking-tight"}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export default AnimatedNumber;
