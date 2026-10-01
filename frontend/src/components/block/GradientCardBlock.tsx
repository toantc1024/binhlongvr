import { cn } from '@/lib/utils'
import { MagicCard } from '../magicui/magic-card'

const GradientCardBlock = ({
    children, className
}: any) => {
    return (
        <MagicCard
            className={cn(
                "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
                // light styles
                "bg-card text-card-foreground border border-border shadow-xs",
                // dark styles
                "transform-gpu dark:bg-background dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
                className,
            )}
            gradientColor={"rgba(150, 150, 150, 0.15)"}
        >
            {children}
        </MagicCard>
    )
}

export default GradientCardBlock
