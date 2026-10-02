import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { X, Minus } from 'lucide-react'
import type { ReactNode } from 'react'

interface DialogWrapperProps {
    // Trigger
    trigger: ReactNode

    // Content
    children: ReactNode

    // Header props
    showHeader?: boolean
    headerIcon?: ReactNode
    title?: string
    description?: string
    customHeader?: ReactNode // Custom header content (replaces icon, title, description)

    // Footer props
    showFooter?: boolean
    footerContent?: ReactNode

    // Close button
    showCloseButton?: boolean
    closeButtonType?: 'close' | 'minimize'
    closeIcon?: ReactNode
    closeTitle?: string

    // Dialog sizing
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'entire'
    mobileSize?: 'sm' | 'md' | 'lg' | 'full' | 'entire'

    // Custom styling
    className?: string
    contentClassName?: string

    // Custom scrollbar
    useCustomScrollbar?: boolean

    // Custom close
    customClose?: boolean
}

const DialogWrapper = ({
    trigger,
    children,
    showHeader = true,
    headerIcon,
    title,
    description,
    customHeader,
    showFooter = false,
    footerContent,
    showCloseButton = true,
    closeButtonType = 'close',
    closeIcon,
    closeTitle,
    size = 'lg',
    mobileSize = 'full',
    className = '',
    contentClassName = '',
    useCustomScrollbar = false,
}: DialogWrapperProps) => {

    const getSizeClasses = () => {
        // Mobile-first sizing (base classes)
        const mobileSizeMap = {
            sm: 'w-[calc(100vw-16px)] max-w-sm h-[72vh]',
            md: 'w-[calc(100vw-16px)] max-w-md h-[80vh]',
            lg: 'w-[calc(100vw-16px)] max-w-lg h-[88vh]',
            '2xl': 'w-[calc(100vw-16px)] max-w-xl h-[92vh]',
            full: 'w-[calc(100vw-16px)] h-[94vh]',
            entire: 'w-screen h-screen'
        }

        // Desktop/larger screen sizing (sm: breakpoint and above)
        const desktopSizeMap = {
            sm: 'sm:max-w-sm sm:w-[400px] sm:h-[60vh]',
            md: 'sm:max-w-md sm:w-[500px] sm:h-[75vh]',
            lg: 'sm:max-w-lg sm:w-[600px] sm:h-[80vh]',
            xl: 'sm:max-w-xl sm:w-[700px] sm:h-[85vh]',
            '2xl': 'sm:max-w-5xl md:max-w-5xl lg:max-w-6xl sm:w-[94vw] lg:w-[92vw] sm:h-[86vh]',
            full: 'sm:w-[95vw] sm:h-[95vh] sm:max-w-none',
            entire: 'sm:w-screen sm:h-screen sm:max-w-none'
        }

        return `${mobileSizeMap[mobileSize]} ${desktopSizeMap[size]}`
    }

    const scrollbarClass = useCustomScrollbar ? 'hotspot-dialog-scroll' : 'scrollbar-hide'

    return (
        <Dialog >
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>


            <DialogContent
                className={`bg-white/95 text-foreground border border-border p-0 overflow-hidden flex flex-col shadow-2xl backdrop-blur-2xl ${size !== "entire" ? "rounded-2xl !p-0" : "rounded-none"} ${getSizeClasses()} ${className}`}
                showCloseButton={false}
            >
                {/* Always include DialogTitle for accessibility */}
                {(!showHeader || !title) && (
                    <VisuallyHidden.Root>
                        <DialogTitle>Dialog</DialogTitle>
                    </VisuallyHidden.Root>
                )}

                {/* Header - Fixed */}
                {showHeader && (
                    <DialogHeader className='p-3 sm:p-4 md:p-5 flex-shrink-0 border-b border-border'>
                        <div className='flex items-center justify-between gap-3'>
                            {customHeader ? (
                                // Custom header content
                                <div className='flex-1 min-w-0'>
                                    {customHeader}
                                </div>
                            ) : (
                                // Default header content
                                <div className='flex items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0'>
                                    {headerIcon && (
                                        <div className='w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-secondary border border-border text-foreground flex items-center justify-center flex-shrink-0'>
                                            {headerIcon}
                                        </div>
                                    )}
                                    <div className='flex-1 min-w-0'>
                                        {title && (
                                            <DialogTitle className='text-foreground text-base sm:text-lg md:text-xl font-bold truncate'>
                                                {title}
                                            </DialogTitle>
                                        )}
                                        {description && (
                                            <DialogDescription className='text-muted-foreground text-xs sm:text-sm truncate mt-0.5'>
                                                {description}
                                            </DialogDescription>
                                        )}
                                    </div>
                                </div>
                            )}
                            {showCloseButton && (
                                <DialogClose asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        title={closeTitle || (closeButtonType === 'minimize' ? 'Thu nhỏ' : 'Đóng')}
                                        className='rounded-full w-9 h-9 sm:w-10 sm:h-10 p-0 bg-secondary hover:bg-secondary/80 text-foreground border border-border flex-shrink-0 cursor-pointer transition-colors flex items-center justify-center active:scale-95'
                                    >
                                        {closeIcon ? (
                                            closeIcon
                                        ) : closeButtonType === 'minimize' ? (
                                            <Minus className="w-4 h-4 text-foreground" strokeWidth={2.5} />
                                        ) : (
                                            <X className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                                        )}
                                    </Button>
                                </DialogClose>
                            )}
                        </div>
                    </DialogHeader>
                )}

                {/* Content - Scrollable */}
                <div className={`flex-1 overflow-y-auto ${scrollbarClass} px-4 pb-4 sm:px-6 ${size === "entire" ? "!p-0" : ""} ${contentClassName}`}>
                    {children}
                </div>

                {/* Footer - Fixed */}
                {showFooter && footerContent && (
                    <div className='p-4 sm:p-6 pt-3 sm:pt-4 flex-shrink-0 border-t border-border bg-secondary/40'>
                        {footerContent}
                    </div>
                )}
            </DialogContent>

        </Dialog>
    )
}

export default DialogWrapper
