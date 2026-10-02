import React, { useMemo, useState, useRef } from 'react'
import DialogWrapper from './DialogWrapper'
import { SearchIcon, ArrowRight, Package, Blocks } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent } from '../ui/card'
import type { Hotspot } from '@/types/hotspots.service.type'
import type { Asset } from '@/types/asset.type'
import useAssetStore from '@/store/asset.store'
import { DialogClose } from '@/components/ui/dialog'

// AssetResultCard component
const AssetResultCard: React.FC<{ asset: Asset; onSelect: (asset: Asset) => void }> = ({ asset, onSelect }) => {
    return (
        <Card className="overflow-hidden shadow-xs bg-white hover:bg-secondary/70 !py-0 hover:shadow-md hover:border-primary/40 transition-all duration-300 cursor-pointer group backdrop-blur-md border border-border" onClick={() => onSelect(asset)}>
            <CardContent className="!p-0 flex">
                {/* Preview Image */}
                <div className="w-36 h-32 overflow-hidden flex-shrink-0 rounded-l-lg">
                    {asset.image_url ? (
                        <img
                            src={asset.image_url}
                            alt={asset.title || 'Asset preview'}
                            className="w-full h-full md:group-hover:scale-[1.08] transition-all ease-in-out duration-150 object-cover rounded-l-xl"
                        />
                    ) : (
                        <div className="w-full h-full bg-secondary flex rounded-l-xl items-center justify-center">
                            <Package className="w-8 h-8 text-primary" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 w-full min-w-0">
                    <div className="flex items-start h-full justify-between">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm text-foreground sm:text-base truncate">
                                {asset.title || 'Không có tiêu đề'}
                            </h3>
                            {asset.description && (
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {asset.description}
                                </p>
                            )}
                        </div>

                        {/* Arrow Button */}
                        <div className="pr-1 pt-1 flex items-center justify-center h-full">
                            <div className='w-10 h-10 p-2 rounded-full flex text-primary items-center justify-center bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all'>
                                <ArrowRight className="!size-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

const AssetActionPillBlock = ({
    showMedia,
    hotspot
}: {
    showMedia: (mediaName: string) => void;
    hotspot: Hotspot | null
}) => {

    const [search, setSearch] = useState<string>('')
    const { setCurrentAsset } = useAssetStore(state => state)
    const dialogCloseRef = useRef<HTMLButtonElement>(null)

    const filteredAssets = useMemo(() => {
        if (!search.trim()) return hotspot?.assets || []

        const searchLower = search.toLowerCase().trim()
        return hotspot?.assets?.filter(asset =>
            asset.title?.toLowerCase().includes(searchLower)
        ) || []
    }, [search, hotspot?.assets])

    const handleSelectAsset = (asset: Asset) => {
        setCurrentAsset(asset)
        if (asset.panorama_id) {
            showMedia(asset.panorama_id)
        }

        if (dialogCloseRef.current) {
            dialogCloseRef.current.click()
        }
    }

    return (
        <DialogWrapper
            customClose={true}
            customHeader={<div>
                <div className="flex h-10 items-center gap-2 bg-secondary/80 border border-border text-foreground rounded-full px-4 shadow-inner">
                    <SearchIcon className="size-4 text-primary shrink-0" />
                    <Input
                        className='placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-0 focus-visible:ring-transparent border-none text-foreground font-medium'
                        placeholder='Tìm kiếm vật phẩm...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {/* Hidden close button for programmatic control */}
                <DialogClose ref={dialogCloseRef} className="hidden" />
            </div>}
            trigger={<Button
                variant="outline"
                key={"assets"}
                className="h-12 sm:h-13 px-4 sm:px-5 shadow-xs rounded-full bg-white/95 hover:bg-secondary text-foreground hover:text-primary border border-border flex items-center justify-center cursor-pointer font-bold text-sm sm:text-base shrink-0 transition-all active:scale-95"
            >
                <Blocks className="!size-5 sm:!size-5.5 mr-2 text-primary shrink-0" />
                <span>Vật phẩm</span>
            </Button>}
            showHeader={true}
            headerIcon={<Blocks className="w-5 h-5 text-primary" />}
            title="Tìm kiếm vật phẩm"
            description="Tìm kiếm vật phẩm trong không gian ảo"
            showCloseButton={true}
            showFooter={false}
            size="lg"
            mobileSize="lg"
            useCustomScrollbar={true}
        >
            <div className="space-y-3">
                {(filteredAssets && filteredAssets.length > 0) ? (
                    filteredAssets.map((asset) => (
                        <AssetResultCard
                            key={asset.asset_id}
                            asset={asset}
                            onSelect={handleSelectAsset}
                        />
                    ))
                ) : (
                    <div className="text-center py-8 bg-secondary/50 rounded-xl border border-border shadow-xs">
                        <Package className="w-12 h-12 text-primary mx-auto mb-4" />
                        <p className="text-foreground font-medium">
                            {search.trim() ? 'Không tìm thấy vật phẩm phù hợp' : 'Không có vật phẩm nào'}
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

export default AssetActionPillBlock;