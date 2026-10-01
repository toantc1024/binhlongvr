
import { Button } from '../ui/button'
import DialogWrapper from './DialogWrapper'
import {
    InfoIcon,
} from 'lucide-react'
import type { Hotspot } from '@/types/hotspots.service.type'
import type { Panorama } from '@/types/panoramas.service.type'

import HotspotInfoBlock from './HotspotInfoBlock'

const HotspotInfoDialogBlock = ({
    pill, hotspot
}: {
    pill: any
    hotspot: Hotspot | null
    panoramas?: Panorama[]
}) => {
    return (
        <DialogWrapper
            trigger={
                <Button
                    variant="outline"
                    key={pill.id}
                    className="shadow-xs rounded-full bg-white/95 hover:bg-secondary text-foreground border border-border flex items-center justify-center cursor-pointer font-medium transition-all duration-200 hover:scale-105"
                >
                    {pill.icon && (
                        <pill.icon className="w-3.5 h-3.5 mr-1 text-foreground" />
                    )}
                    {pill.label}
                </Button>
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
