import React, { useMemo, useRef, useState } from 'react'
import DialogWrapper from './DialogWrapper'
import { Search, SearchIcon, ArrowRight, MapPin } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent } from '../ui/card'
import useVRStore from '@/store/vr.store'
import type { Hotspot } from '@/types/hotspots.service.type'

// SearchResultCard component
const SearchResultCard: React.FC<{ hotspot: Hotspot; onSelect: (hotspot: Hotspot) => void }> = ({ hotspot, onSelect }) => {
    return (
        <Card className="overflow-hidden shadow-xs bg-white hover:bg-secondary !py-0 hover:shadow-md hover:border-border transition-all duration-300 cursor-pointer group backdrop-blur-md border border-border" onClick={() => onSelect(hotspot)}>
            <CardContent className="!p-0 flex">
                {/* Preview Image */}
                <div className="w-36 h-32 overflow-hidden flex-shrink-0 rounded-l-lg">
                    {hotspot.preview_image ? (
                        <img
                            src={hotspot.preview_image}
                            alt={hotspot.title || 'Hotspot preview'}
                            className="w-full h-full md:group-hover:scale-[1.08] transition-all ease-in-out duration-150 object-cover rounded-l-xl"
                        />
                    ) : (
                        <div className="w-full h-full bg-secondary flex rounded-l-xl items-center justify-center">
                            <MapPin className="w-8 h-8 text-primary" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 w-full min-w-0">
                    <div className="flex items-start h-full justify-between">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm text-foreground sm:text-base truncate">
                                {hotspot.title || 'Không có tiêu đề'}
                            </h3>
                            {hotspot.description && (
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {hotspot.description}
                                </p>
                            )}
                            {hotspot.address && (
                                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                    <MapPin className="w-3.5 h-3.5 mr-1 text-primary flex-shrink-0" />
                                    <span className="truncate">{hotspot.address}</span>
                                </div>
                            )}
                        </div>

                        {/* Arrow Button */}
                        <div className="pr-1 pt-1 flex items-center justify-center h-full">
                            <div className='w-10 h-10 p-2 rounded-full flex text-foreground items-center justify-center bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-all'>
                                <ArrowRight className="!size-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

const SearchDialogBlock = ({
    showMedia
}: {
    showMedia: (mediaName: string) => void;
}) => {

    const { areaHotspots } = useVRStore((state) => state)
    const [search, setSearch] = useState<string>('')
    const buttonRef = useRef<HTMLButtonElement>(null)

    const triggerClick = () => {
        if (buttonRef.current) {
            buttonRef.current.click()
        }
    }

    const filteredHotspots = useMemo(() => {
        if (!search.trim()) return areaHotspots

        const searchLower = search.toLowerCase().trim()
        return areaHotspots.filter(hotspot =>
            hotspot.title?.toLowerCase().includes(searchLower) ||
            hotspot.description?.toLowerCase().includes(searchLower) ||
            hotspot.address?.toLowerCase().includes(searchLower)
        )
    }, [search, areaHotspots])

    const handleSelectHotspot = (hotspot: Hotspot) => {
        showMedia(hotspot.click_panorama_id || '')
        triggerClick()
    }

    return (
        <DialogWrapper
            customClose={true}
            customHeader={<div>
                <div className="flex h-10 items-center gap-2 bg-secondary border border-border text-foreground rounded-full px-4 shadow-inner">
                    <SearchIcon className="size-4 text-foreground shrink-0" />
                    <Input
                        className='placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-0 focus-visible:ring-transparent border-none text-foreground font-medium'
                        placeholder='Tìm kiếm địa điểm...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>}
            trigger={<Button ref={buttonRef} variant="outline" className="w-12 h-12 xl:w-16 xl:h-16 shadow-lg rounded-full bg-white/95 hover:bg-secondary text-foreground border border-border flex items-center justify-center cursor-pointer backdrop-blur-md">
                <Search className="!size-6 sm:!size-7 xl:!size-9 text-foreground" />
            </Button>}
            showHeader={true}
            headerIcon={<Search className="w-5 h-5 text-foreground" />}
            title="Tìm kiếm"
            description="Tìm kiếm không gian ảo"
            showCloseButton={true}
            showFooter={false}
            size="lg"
            mobileSize="lg"
            useCustomScrollbar={true}
        >
            <div className="space-y-3">
                {filteredHotspots.length > 0 ? (
                    filteredHotspots.map((hotspot) => (
                        <SearchResultCard
                            key={hotspot.hotspot_id}
                            hotspot={hotspot}
                            onSelect={handleSelectHotspot}
                        />
                    ))
                ) : (
                    <div className="text-center py-8 bg-secondary/50 rounded-xl border border-border shadow-xs">
                        <Search className="w-12 h-12 text-primary mx-auto mb-4" />
                        <p className="text-foreground font-medium">
                            {search.trim() ? 'Không tìm thấy kết quả phù hợp' : 'Không có địa điểm nào'}
                        </p>
                        {search.trim() && (
                            <p className="text-sm text-muted-foreground mt-2">
                                Thử tìm kiếm với từ khóa khác
                            </p>
                        )}
                    </div>
                )}
            </div>
        </DialogWrapper>
    )
}

export default SearchDialogBlock
