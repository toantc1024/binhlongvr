import React, { useMemo, useRef, useState, useEffect } from 'react'
import DialogWrapper from './DialogWrapper'
import {
    Search,
    ArrowRight,
    MapPin,
    Compass,
    ChevronLeft,
    ChevronRight,
    Volume2,
    VolumeX,
    Maximize2,
    Sparkles,
    X,
    Eye
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import useVRStore from '@/store/vr.store'
import type { Hotspot } from '@/types/hotspots.service.type'
import type { Panorama } from '@/types/panoramas.service.type'
import { BINHLONG_PANORAMAS } from '@/constants/binhlong.constants'
import { DialogClose } from '@radix-ui/react-dialog'

interface SearchDialogBlockProps {
    showMedia: (mediaName: string) => void
}

const SearchDialogBlock: React.FC<SearchDialogBlockProps> = ({ showMedia }) => {
    const { areaHotspots, currentHotspot } = useVRStore((state) => state)
    const [search, setSearch] = useState<string>('')
    const [selectedHotspotId, setSelectedHotspotId] = useState<number>(
        currentHotspot?.hotspot_id || 130
    )
    const [activePanoramaIndex, setActivePanoramaIndex] = useState<number>(0)
    const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false)

    const buttonRef = useRef<HTMLButtonElement>(null)
    const dialogCloseRef = useRef<HTMLButtonElement>(null)
    const thumbnailScrollRef = useRef<HTMLDivElement>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Sync selected hotspot if currentHotspot changes
    useEffect(() => {
        if (currentHotspot?.hotspot_id) {
            setSelectedHotspotId(currentHotspot.hotspot_id)
        }
    }, [currentHotspot])

    // Filtered hotspots based on search input
    const filteredHotspots = useMemo(() => {
        if (!search.trim()) return areaHotspots

        const searchLower = search.toLowerCase().trim()
        return areaHotspots.filter(
            (hotspot) =>
                hotspot.title?.toLowerCase().includes(searchLower) ||
                hotspot.description?.toLowerCase().includes(searchLower) ||
                hotspot.address?.toLowerCase().includes(searchLower)
        )
    }, [search, areaHotspots])

    // Currently active hotspot object
    const activeHotspot: Hotspot = useMemo(() => {
        const found = areaHotspots.find((h) => h.hotspot_id === selectedHotspotId)
        if (found) return found
        return filteredHotspots[0] || areaHotspots[0]
    }, [selectedHotspotId, areaHotspots, filteredHotspots])

    // Panoramas corresponding to the active hotspot
    const hotspotPanoramas: Panorama[] = useMemo(() => {
        if (!activeHotspot) return []
        const list = BINHLONG_PANORAMAS.filter(
            (p) => p.hotspot_id === activeHotspot.hotspot_id
        )
        if (list.length > 0) return list

        // Fallback single item if no list
        return [
            {
                panorama_id: activeHotspot.click_panorama_id || 'preview',
                hotspot_id: activeHotspot.hotspot_id,
                title: activeHotspot.title || 'Toàn cảnh di tích',
                preview_image: activeHotspot.preview_image || '',
                created_at: new Date().toISOString(),
            },
        ]
    }, [activeHotspot])

    // Reset active panorama index when changing hotspot
    useEffect(() => {
        setActivePanoramaIndex(0)
        setIsPlayingAudio(false)
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
    }, [activeHotspot?.hotspot_id])

    // Active panorama object
    const currentPanorama: Panorama | undefined = hotspotPanoramas[activePanoramaIndex] || hotspotPanoramas[0]

    // Carousel navigation
    const handlePrevPanorama = (e: React.MouseEvent) => {
        e.stopPropagation()
        setActivePanoramaIndex((prev) =>
            prev === 0 ? hotspotPanoramas.length - 1 : prev - 1
        )
    }

    const handleNextPanorama = (e: React.MouseEvent) => {
        e.stopPropagation()
        setActivePanoramaIndex((prev) =>
            prev === hotspotPanoramas.length - 1 ? 0 : prev + 1
        )
    }

    // Scroll thumbnail container
    const scrollThumbnails = (direction: 'left' | 'right') => {
        if (thumbnailScrollRef.current) {
            const offset = direction === 'left' ? -220 : 220
            thumbnailScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
        }
    }

    // Enter VR action
    const handleEnterVR = (panoramaId?: string) => {
        const targetId = panoramaId || currentPanorama?.panorama_id || activeHotspot?.click_panorama_id || ''
        showMedia(targetId)
        if (dialogCloseRef.current) {
            dialogCloseRef.current.click()
        }
    }

    // Toggle audio
    const toggleAudio = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!audioRef.current) return
        if (isPlayingAudio) {
            audioRef.current.pause()
            setIsPlayingAudio(false)
        } else {
            audioRef.current.play().then(() => {
                setIsPlayingAudio(true)
            }).catch(() => {
                setIsPlayingAudio(false)
            })
        }
    }

    return (
        <DialogWrapper
            size="2xl"
            mobileSize="full"
            showCloseButton={true}
            closeButtonType="minimize"
            closeTitle="Thu nhỏ"
            useCustomScrollbar={true}
            trigger={
                <Button
                    ref={buttonRef}
                    variant="outline"
                    title="Tìm kiếm địa điểm di tích"
                    className="w-12 h-12 xl:w-16 xl:h-16 shadow-lg rounded-full bg-white/95 hover:bg-secondary text-foreground border border-border flex items-center justify-center cursor-pointer backdrop-blur-md"
                >
                    <Search className="!size-6 sm:!size-7 xl:!size-9 text-foreground" />
                </Button>
            }
            customHeader={
                <div className="w-full flex flex-col gap-2">
                    {/* Full-width Search Bar */}
                    <div className="relative w-full flex items-center bg-secondary/80 hover:bg-secondary border border-border text-foreground rounded-full px-4 py-1 shadow-inner transition-colors">
                        <Search className="size-4 sm:size-5 text-muted-foreground shrink-0 mr-2.5" />
                        <Input
                            className="w-full h-9 sm:h-10 bg-transparent py-2 text-sm sm:text-base outline-none focus-visible:ring-0 focus-visible:ring-transparent border-none text-foreground font-medium placeholder:text-muted-foreground p-0"
                            placeholder="Tìm kiếm di tích, địa danh tại Phường Bình Long..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                                title="Xóa tìm kiếm"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>

                    {/* Quick location selection chips */}
                    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide py-0.5 text-xs">
                        <button
                            onClick={() => setSearch('')}
                            className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors border ${
                                !search
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                    : 'bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
                            }`}
                        >
                            Tất cả ({areaHotspots.length})
                        </button>
                        {areaHotspots.map((h) => {
                            const isSelected = activeHotspot?.hotspot_id === h.hotspot_id
                            return (
                                <button
                                    key={h.hotspot_id}
                                    onClick={() => {
                                        setSelectedHotspotId(h.hotspot_id)
                                    }}
                                    className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors border ${
                                        isSelected
                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                            : 'bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
                                    }`}
                                >
                                    {h.title?.replace('Di tích Lịch sử Quốc gia ', '').replace('Di tích Lịch sử - Văn hóa ', '').replace('Di tích Lịch sử ', '')}
                                </button>
                            )
                        })}
                    </div>
                </div>
            }
        >
            {/* Hidden close trigger for programmatic dismiss */}
            <DialogClose ref={dialogCloseRef} className="hidden" />

            {/* Audio element for narration */}
            {activeHotspot?.metadata?.audio_url && (
                <audio
                    ref={audioRef}
                    src={activeHotspot.metadata.audio_url}
                    onEnded={() => setIsPlayingAudio(false)}
                    onError={() => setIsPlayingAudio(false)}
                />
            )}

            {activeHotspot ? (
                <div className="w-full flex flex-col md:flex-row gap-5 lg:gap-7 items-stretch py-2 min-h-[460px]">
                    {/* LEFT PANEL: Place Details & Comprehensive Info */}
                    <div className="w-full md:w-[45%] lg:w-[42%] flex flex-col justify-between rounded-2xl bg-card border border-border/80 p-5 sm:p-6 shadow-sm">
                        <div className="space-y-4">
                            {/* Badges row */}
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge className="bg-emerald-600 text-white font-medium hover:bg-emerald-700 px-2.5 py-0.5 text-xs">
                                    <Sparkles className="size-3 mr-1" />
                                    {activeHotspot.hotspot_id === 132
                                        ? 'Di tích Quốc gia'
                                        : 'Di tích cấp Tỉnh'}
                                </Badge>
                                <span className="text-xs text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded-md border border-border/50">
                                    ID: #{activeHotspot.hotspot_id}
                                </span>
                            </div>

                            {/* Place Title & Subtitle */}
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug tracking-tight text-left">
                                    {activeHotspot.title}
                                </h2>
                                <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 font-medium mt-1 text-left whitespace-nowrap">
                                    Phường Bình Long, TP.&nbsp;Đồng&nbsp;Nai
                                </p>
                            </div>

                            {/* Address & Geolocation */}
                            <div className="space-y-1.5 text-left border-y border-border/60 py-3 text-sm">
                                <div className="flex items-start gap-2 text-foreground">
                                    <MapPin className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span className="font-medium text-xs sm:text-sm leading-relaxed">
                                        {activeHotspot.address || 'Phường Bình Long, Thành phố Đồng Nai'}
                                    </span>
                                </div>
                                {activeHotspot.geolocation && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground pl-6">
                                        <span>Tọa độ GPS:</span>
                                        <code className="font-mono bg-muted/70 px-1.5 py-0.5 rounded text-[11px] text-foreground">
                                            {activeHotspot.geolocation.lat.toFixed(6)}, {activeHotspot.geolocation.lon.toFixed(6)}
                                        </code>
                                    </div>
                                )}
                            </div>

                            {/* Historical Description */}
                            <div className="text-left space-y-1.5">
                                <h4 className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                                    Thông tin tóm tắt & Lịch sử
                                </h4>
                                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-normal max-h-36 sm:max-h-48 overflow-y-auto pr-1 scrollbar-hide text-justify">
                                    {activeHotspot.description}
                                </p>
                            </div>

                            {/* Audio Narration trigger if available */}
                            {activeHotspot.metadata?.audio_url && (
                                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="size-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                            {isPlayingAudio ? (
                                                <Volume2 className="size-4 animate-pulse" />
                                            ) : (
                                                <VolumeX className="size-4" />
                                            )}
                                        </div>
                                        <div className="min-w-0 text-left">
                                            <p className="text-xs font-semibold text-foreground truncate">
                                                Thuyết minh giọng đọc AI
                                            </p>
                                            <p className="text-[11px] text-muted-foreground truncate">
                                                {isPlayingAudio ? 'Đang phát âm thanh...' : 'Nhấn để nghe thuyết minh'}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={toggleAudio}
                                        className="h-8 px-3 text-xs font-medium border-emerald-600/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white cursor-pointer"
                                    >
                                        {isPlayingAudio ? 'Tạm dừng' : 'Nghe ngay'}
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Full-width Solid Action Button at Bottom */}
                        <div className="pt-4 mt-2">
                            <Button
                                onClick={() => handleEnterVR()}
                                className="w-full h-12 sm:h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl flex items-center justify-between shadow-xl shadow-emerald-600/25 hover:shadow-2xl transition-all text-base sm:text-lg cursor-pointer"
                            >
                                <span>Khám phá không gian VR 360°</span>
                                <ArrowRight className="size-5 sm:size-6 shrink-0" />
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Google Maps Style Photo Carousel & Viewpoint Gallery */}
                    <div className="w-full md:w-[55%] lg:w-[58%] flex flex-col justify-between rounded-2xl bg-card border border-border/80 p-3 sm:p-4 shadow-sm">
                        {/* Main Featured Photo Display with Hover Chevrons */}
                        <div className="relative group w-full h-[260px] sm:h-[320px] md:h-[360px] rounded-xl overflow-hidden bg-slate-950 border border-border/60 shadow-inner flex items-center justify-center">
                            {/* Background Image */}
                            <img
                                src={currentPanorama?.preview_image || activeHotspot.preview_image || undefined}
                                alt={currentPanorama?.title || activeHotspot.title || 'Địa điểm di tích'}
                                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />

                            {/* Ambient dark gradient overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

                            {/* Top Badges: 360° & Counter */}
                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/20 shadow-md">
                                    <Compass className="size-3.5 text-emerald-400 animate-spin-slow" />
                                    <span>Góc nhìn 360° VR</span>
                                </div>

                                <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono font-medium border border-white/20">
                                    {activePanoramaIndex + 1} / {hotspotPanoramas.length} góc nhìn
                                </div>
                            </div>

                            {/* Large Green-White Chevrons that appear on hover */}
                            {hotspotPanoramas.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevPanorama}
                                        title="Góc nhìn trước"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 size-10 sm:size-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-20 cursor-pointer border border-white/30"
                                    >
                                        <ChevronLeft className="size-6 text-white stroke-[2.5]" />
                                    </button>
                                    <button
                                        onClick={handleNextPanorama}
                                        title="Góc nhìn tiếp theo"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 size-10 sm:size-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-20 cursor-pointer border border-white/30"
                                    >
                                        <ChevronRight className="size-6 text-white stroke-[2.5]" />
                                    </button>
                                </>
                            )}

                            {/* Bottom Title & Direct Entry Button */}
                            <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2 z-10">
                                <div className="text-left text-white drop-shadow-md">
                                    <p className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">
                                        Điểm nhìn hiện tại
                                    </p>
                                    <h3 className="text-sm sm:text-base font-bold line-clamp-1">
                                        {currentPanorama?.title || activeHotspot.title}
                                    </h3>
                                </div>

                                <Button
                                    size="sm"
                                    onClick={() => handleEnterVR(currentPanorama?.panorama_id)}
                                    className="bg-white/95 hover:bg-white text-emerald-950 font-semibold rounded-lg text-xs px-3.5 py-1.5 shadow-md flex items-center gap-1.5 shrink-0 hover:scale-105 transition-all cursor-pointer"
                                >
                                    <Maximize2 className="size-3.5 text-emerald-600" />
                                    <span>Vào góc nhìn này</span>
                                </Button>
                            </div>
                        </div>

                        {/* Google Maps Photo Strip / Thumbnail Carousel */}
                        <div className="mt-3 relative w-full">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left flex items-center gap-1">
                                    <Eye className="size-3.5 text-emerald-600" />
                                    Bộ sưu tập toàn cảnh ({hotspotPanoramas.length} góc nhìn)
                                </span>
                                {hotspotPanoramas.length > 4 && (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => scrollThumbnails('left')}
                                            className="size-6 rounded-full bg-secondary hover:bg-secondary/80 border border-border flex items-center justify-center text-foreground cursor-pointer transition-colors"
                                            title="Cuộn sang trái"
                                        >
                                            <ChevronLeft className="size-3.5" />
                                        </button>
                                        <button
                                            onClick={() => scrollThumbnails('right')}
                                            className="size-6 rounded-full bg-secondary hover:bg-secondary/80 border border-border flex items-center justify-center text-foreground cursor-pointer transition-colors"
                                            title="Cuộn sang phải"
                                        >
                                            <ChevronRight className="size-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Horizontal scroll strip */}
                            <div
                                ref={thumbnailScrollRef}
                                className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide py-1 px-0.5"
                            >
                                {hotspotPanoramas.map((panorama, idx) => {
                                    const isActive = idx === activePanoramaIndex
                                    return (
                                        <div
                                            key={panorama.panorama_id}
                                            onClick={() => setActivePanoramaIndex(idx)}
                                            onDoubleClick={() => handleEnterVR(panorama.panorama_id)}
                                            title={`${panorama.title} (Nhấp đúp để vào ngay)`}
                                            className={`group/thumb relative shrink-0 w-24 sm:w-28 h-18 sm:h-20 rounded-xl p-1 bg-white dark:bg-card border-2 cursor-pointer transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
                                                isActive
                                                    ? 'border-emerald-600 ring-2 ring-emerald-500/30 scale-105'
                                                    : 'border-border/70 hover:border-emerald-500/60 opacity-80 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={panorama.preview_image}
                                                alt={panorama.title}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <div className="absolute inset-1 rounded-lg bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                                                <p className="text-[10px] text-white font-medium truncate w-full text-left leading-tight">
                                                    {panorama.title.replace('Toàn cảnh ', '').replace(' (Flycam 360°)', '')}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 bg-secondary/50 rounded-2xl border border-border">
                    <Search className="size-12 text-primary mx-auto mb-3" />
                    <p className="text-foreground font-semibold text-base">
                        Không tìm thấy địa điểm nào khớp với từ khóa "{search}"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5">
                        Vui lòng thử tìm kiếm lại với tên khác hoặc chọn từ danh sách di tích.
                    </p>
                </div>
            )}
        </DialogWrapper>
    )
}

export default SearchDialogBlock
