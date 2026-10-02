import { useState } from 'react'
import { Button } from '../ui/button'
import DialogWrapper from './DialogWrapper'
import {
    Share2,
    Copy,
    CheckCircle,
    MessageCircle,
    Facebook,
} from 'lucide-react'
import { toast } from 'sonner'

interface ShareDialogBlockProps {
    pill: {
        id: string
        label: string
        icon: any
    }
    shareData?: {
        title?: string
        description?: string
        url?: string
    }
}

const ShareDialogBlock = ({ pill, shareData }: ShareDialogBlockProps) => {
    const [copied, setCopied] = useState(false)

    // Get current page URL or use provided URL
    const currentUrl = shareData?.url || (typeof window !== 'undefined' ? window.location.href : '')
    const title = shareData?.title || (typeof document !== 'undefined' ? document.title : 'Bản Đồ Số VR Di Tích Phường Bình Long - Thực Tế Ảo 360°')
    const description = shareData?.description || 'Khám phá các di tích lịch sử và văn hóa Phường Bình Long, Thành phố Đồng Nai qua công nghệ thực tế ảo tương tác đa chiều.'

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl)
            setCopied(true)
            toast.success('Đã sao chép liên kết!')
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy: ', err)
            toast.error('Không thể sao chép liên kết')
        }
    }

    const shareToMessenger = () => {
        try {
            const messengerUrl = `fb-messenger://share/?link=${encodeURIComponent(currentUrl)}`
            const webUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(currentUrl)}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(currentUrl)}`

            // Try app protocol first, fallback to web
            window.open(messengerUrl, '_blank')

            // Fallback for web if app doesn't open
            setTimeout(() => {
                const userAgent = navigator.userAgent.toLowerCase()
                if (!userAgent.includes('fban') && !userAgent.includes('fbav')) {
                    window.open(webUrl, '_blank', 'width=600,height=400')
                }
            }, 500)
        } catch (err) {
            console.error('Failed to share to Messenger: ', err)
            toast.error('Không thể chia sẻ qua Messenger')
        }
    }

    const shareToFacebook = () => {
        try {
            const facebookAppUrl = `fb://share?href=${encodeURIComponent(currentUrl)}`
            const facebookWebUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(title)}`

            // Try app protocol first
            window.open(facebookAppUrl, '_blank')

            // Fallback to web
            setTimeout(() => {
                window.open(facebookWebUrl, '_blank', 'width=600,height=400')
            }, 500)
        } catch (err) {
            console.error('Failed to share to Facebook: ', err)
            toast.error('Không thể chia sẻ lên Facebook')
        }
    }

    const shareOptions = [
        {
            id: 'copy',
            label: 'Sao chép liên kết',
            icon: copied ? CheckCircle : Copy,
            onClick: copyToClipboard,
            className: copied ? 'text-emerald-600' : 'text-primary',
            iconBgClass: copied ? 'bg-emerald-500/15 border-emerald-500/30' : 'bg-primary/10 border-primary/20',
            description: 'Sao chép URL để chia sẻ'
        },
        {
            id: 'messenger',
            label: 'Messenger',
            icon: MessageCircle,
            onClick: shareToMessenger,
            className: 'text-primary',
            iconBgClass: 'bg-primary/10 border-primary/20',
            description: 'Chia sẻ qua Facebook Messenger'
        },
        {
            id: 'facebook',
            label: 'Facebook',
            icon: Facebook,
            onClick: shareToFacebook,
            className: 'text-foreground',
            iconBgClass: 'bg-primary/10 border-primary/20',
            description: 'Chia sẻ lên Facebook'
        }
    ]

    // Native Web Share API fallback
    const nativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: description,
                    url: currentUrl
                })
            } catch (err) {
                console.error('Error sharing:', err)
                // Only show error if it's not a user cancellation
                if (err instanceof Error && err.name !== 'AbortError') {
                    toast.error('Không thể chia sẻ')
                }
            }
        }
    }

    return (
        <DialogWrapper
            trigger={
                <Button
                    variant="outline"
                    key={pill.id}
                    className="h-12 sm:h-13 px-4 sm:px-5 shadow-xs rounded-full bg-white/95 hover:bg-secondary text-foreground border border-border flex items-center justify-center cursor-pointer font-bold text-sm sm:text-base shrink-0 transition-all active:scale-95"
                >
                    {pill.icon && (
                        <pill.icon className="!size-5 sm:!size-5.5 mr-2 text-primary shrink-0" />
                    )}
                    <span>{pill.label}</span>
                </Button>
            }
            showHeader={true}
            headerIcon={<Share2 className="w-5 h-5 text-primary" />}
            title="Chia sẻ"
            description="Chia sẻ không gian ảo này"
            showCloseButton={true}
            showFooter={false}
            size="md"
            mobileSize="md"
            useCustomScrollbar={true}
        >
            <div className="space-y-4">
                {/* Share Options */}
                <div className="space-y-3">
                    <h4 className="text-foreground text-sm font-semibold">Chọn phương thức chia sẻ</h4>
                    <div className="grid grid-cols-1 gap-3">
                        {shareOptions.map((option) => (
                            <Button
                                variant="ghost"
                                key={option.id}
                                onClick={option.onClick}
                                className="bg-secondary/60 hover:bg-secondary rounded-xl p-4 h-auto flex items-center gap-3 justify-start transition-all hover:scale-[1.01] border border-border cursor-pointer text-left"
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${option.iconBgClass}`}>
                                    <option.icon className={`w-5 h-5 ${option.className}`} />
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <p className="text-foreground font-semibold text-sm">{option.label}</p>
                                    <p className="text-muted-foreground text-xs truncate">{option.description}</p>
                                </div>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Native Share (if available) */}
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <div className="pt-2 border-t border-border">
                        <Button
                            variant="ghost"
                            onClick={nativeShare}
                            className="w-full bg-secondary/60 hover:bg-secondary border border-border rounded-xl p-3 text-foreground hover:text-primary font-medium transition-colors cursor-pointer"
                        >
                            <Share2 className="w-4 h-4 mr-2 text-primary" />
                            Chia sẻ khác
                        </Button>
                    </div>
                )}
            </div>
        </DialogWrapper>
    )
}

export default ShareDialogBlock
