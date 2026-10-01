"use client";

import React, { forwardRef, useRef } from "react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { BrainCircuitIcon, FileIcon, ImageIcon, MusicIcon, UserIcon } from "lucide-react";

const Circle = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 flex size-12 items-center justify-center rounded-full border border-border bg-card p-3 shadow-md",
                className,
            )}
        >
            {children}
        </div>
    );
});

Circle.displayName = "Circle";

export function AnimatedBeamMultipleInputs({
    className,
}: {
    className?: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const div1Ref = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);
    const div3Ref = useRef<HTMLDivElement>(null);
    const div4Ref = useRef<HTMLDivElement>(null);
    const div5Ref = useRef<HTMLDivElement>(null);
    const div6Ref = useRef<HTMLDivElement>(null);
    const div7Ref = useRef<HTMLDivElement>(null);

    return (
        <div
            className={cn(
                "relative flex h-[500px] w-full items-center justify-center overflow-hidden p-10",
                className,
            )}
            ref={containerRef}
        >
            <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
                <div className="flex flex-col justify-center gap-2">
                    <Circle ref={div1Ref} className="bg-gradient-to-r border-none text-white from-emerald-500 to-teal-600">
                        <FileIcon />
                    </Circle>
                    <Circle ref={div2Ref} className="bg-gradient-to-r border-none text-white from-green-500 to-emerald-400">
                        <MusicIcon className="" />
                    </Circle>
                    <Circle ref={div3Ref} className="bg-gradient-to-r border-none text-white from-red-400 to-purple-500">
                        <ImageIcon />
                    </Circle>

                </div>
                <div className="flex flex-col justify-center">
                    <Circle ref={div6Ref} className="bg-card border-2 border-primary/20 text-primary !size-16 shadow-lg">
                        <BrainCircuitIcon />
                    </Circle>
                </div>
                <div className="flex flex-col justify-center">
                    <Circle ref={div7Ref} className="bg-gradient-to-r border-none text-white from-emerald-400 to-emerald-300 ">
                        <UserIcon />
                    </Circle>
                </div>
            </div >

            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div1Ref}
                toRef={div6Ref}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div2Ref}
                toRef={div6Ref}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div3Ref}
                toRef={div6Ref}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div4Ref}
                toRef={div6Ref}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div5Ref}
                toRef={div6Ref}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div6Ref}
                toRef={div7Ref}
            />
        </div >
    );
}