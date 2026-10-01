import { ArrowRightIcon } from "@radix-ui/react-icons";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className: string;
  background: ReactNode;
  Icon?: React.ElementType;
  iconImage?: string;
  description: string;
  href: string;
  cta?: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto lg:auto-rows-[22rem]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  iconImage,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-2xl",
      // light styles - borderless and clean shadow
      "bg-card text-card-foreground border-0 shadow-md hover:shadow-xl transition-all duration-300",
      // dark styles
      "transform-gpu dark:bg-card dark:[box-shadow:0_-20px_80px_-20px_#ffffff15_inset]",
      className,
    )}
    {...props}
  >
    {/* Background artwork: fully responsive, absolute at z-0 */}
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {background}
    </div>

    {/* Content layer: z-10 for perfect legibility and layout */}
    <div className="relative z-10 p-6 sm:p-7 flex flex-col justify-between h-full pointer-events-none">
      <div className="flex flex-col gap-2.5">
        {iconImage ? (
          <div className="size-20 sm:size-24 flex items-center justify-start transform-gpu transition-all duration-300 ease-in-out group-hover:scale-105 pointer-events-none -ml-2 -mt-2">
            <img
              src={iconImage}
              alt={name}
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>
        ) : Icon ? (
          <Icon className="h-12 w-12 origin-left transform-gpu text-primary transition-all duration-300 ease-in-out group-hover:scale-75" />
        ) : null}
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground text-left tracking-tight">
          {name}
        </h3>
        <p className="max-w-md text-muted-foreground text-sm font-normal leading-relaxed text-left">
          {description}
        </p>
      </div>

      {cta && (
        <div className="lg:hidden pointer-events-none flex w-full translate-y-0 transform-gpu flex-row items-center pt-4 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            variant="link"
            asChild
            size="sm"
            className="pointer-events-auto p-0"
          >
            <a href={href}>
              {cta}
              <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
            </a>
          </Button>
        </div>
      )}
    </div>

    {cta && (
      <div className="hidden lg:flex pointer-events-none absolute bottom-0 w-full translate-y-10 transform-gpu flex-row items-center p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20">
        <Button
          variant="link"
          asChild
          size="sm"
          className="pointer-events-auto p-0"
        >
          <a href={href}>
            {cta}
            <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
          </a>
        </Button>
      </div>
    )}
    <div className="pointer-events-none absolute inset-0 z-10 transform-gpu transition-all duration-300 group-hover:bg-black/[.02] group-hover:dark:bg-neutral-800/10" />
  </div>
);

export { BentoCard, BentoGrid };
