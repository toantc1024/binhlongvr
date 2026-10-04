
import { Button } from '../ui/button'
import DialogWrapper from './DialogWrapper'
import {
    InfoIcon,
} from 'lucide-react'
import type { Hotspot } from '@/types/hotspots.service.type'
import type { Panorama } from '@/types/panoramas.service.type'

import HotspotInfoBlock from './HotspotInfoBlock'

const HotspotInfoDialogBlock = ({
    pill,
    hotspot,
    trigger,
}: {
    pill?: any
    hotspot: Hotspot | null
    panoramas?: Panorama[]
    trigger?: React.ReactNode
}) => {
    return (
        <DialogWrapper
            trigger={
                trigger ? (
                    trigger
                ) : (
                    <Button
                        variant="outline"
                        key={pill?.id}
                        className="h-12 sm:h-13 px-4 sm:px-5 shadow-xs rounded-full bg-white/95 hover:bg-secondary text-foreground border border-border flex items-center justify-center cursor-pointer font-bold text-sm sm:text-base shrink-0 transition-all active:scale-95"
                    >
                        {pill?.icon && (
                            <pill.icon className="!size-5 sm:!size-5.5 mr-2 text-foreground shrink-0" />
                        )}
                        <span>{pill?.label}</span>
                    </Button>
                )
            }
            showHeader={true}
            headerIcon={<InfoIcon className="w-5 h-5 text-foreground" />}
            title="Thông tin địa điểm"
            description="Chi tiết về điểm tham quan"
            showCloseButton={true}
            showFooter={false}
            size="full"
            mobileSize="full"
            useCustomScrollbar={true}
        >
            <HotspotInfoBlock hotspot={hotspot} />
            {/* <HotspotInfoTabs hotspot={hotspot} /> */}
        </DialogWrapper>
    )
}

export default HotspotInfoDialogBlock
