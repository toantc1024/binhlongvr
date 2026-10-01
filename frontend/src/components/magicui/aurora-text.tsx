"use client";

import React, { memo } from "react";

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

export const AuroraText = memo(
  ({
    children,
    className = "",
    colors = ["#059669", "#10b981", "#047857", "#34d399", "#059669"],
    speed = 1,
  }: AuroraTextProps) => {
    const gradientStyle = {
      backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${
        colors[0]
      })`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animationDuration: `${10 / speed}s`,
    };

    return (
      <span
        className={`relative inline-block animate-aurora bg-[length:200%_auto] bg-clip-text text-transparent ${className}`}
        style={gradientStyle}
      >
        {children}
      </span>
    );
  },
);

AuroraText.displayName = "AuroraText";
