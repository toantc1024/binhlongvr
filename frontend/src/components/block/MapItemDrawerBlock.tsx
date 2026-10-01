import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
import { Drawer } from 'vaul';
import AbsoluteWrapper from "../ui/absolute-wrapper"
import type { Hotspot } from '@/types/hotspots.service.type';
import { MapPin, X } from 'lucide-react';
import { Button } from '../ui/button';
import { RiDirectionFill } from 'react-icons/ri';
import { Carousel, CarouselItem, CarouselContent, CarouselPrevious, CarouselNext } from '../ui/carousel';
import type { Panorama } from '@/types/panoramas.service.type';
import { getPanoramasByHotspotId } from '@/services/panoramas.service';
const snapPoints = ['150px', '350px'];
export default function MapItemDrawerBlock({
    currentHotspot,
    setCurrentHotspot,
    showMedia,
    closeDrawer
}: {
    currentHotspot: Hotspot | null;
    setCurrentHotspot: (hotspot: Hotspot | null) => void;
    showMedia: (mediaName: string) => void;
    closeDrawer: () => void;
}) {
    const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);
    const [panoramas, setPanoramas] = useState<Panorama[]>([]);

    useEffect(() => {
        (async () => {
            if (currentHotspot) {
                let panoramas = await getPanoramasByHotspotId(currentHotspot.hotspot_id);
                setPanoramas(panoramas);
            }
        })()
    }, [currentHotspot, currentHotspot?.hotspot_id])

    // React.useEffect(() => {
    //     setSnap(snapPoints[0]);
    //     (async () => {
    //         if (currentHotspot) {
    //             let panoramas = await getPanoramasByHotspotId(currentHotspot.hotspot_id);
    //             setPanoramas(panoramas);
    //         }

    //     })
    // }, [currentHotspot])



    return (


        <AbsoluteWrapper
            zIndex={2}
            customClassName=" hidden flex m-1 md:m-2 items-center px-1 md:px-2 h-auto rounded-4xl py-1 md:py-2 flex gap-1 md:gap-2 flex-col shadow-sm"
        >
            <Drawer.Root open={!!currentHotspot
            } snapPoints={snapPoints} activeSnapPoint={snap} setActiveSnapPoint={setSnap} fadeFromIndex={1}>

                <Drawer.Overlay className="z-[9999] fixed inset-0 bg-black/40 backdrop-blur-xs" />
                <Drawer.Portal>
                    <Drawer.Content
                        data-testid="content"
                        className="fixed z-[9999] bg-white/95 text-foreground border-t border-border backdrop-blur-2xl rounded-t-4xl bottom-0 left-0 right-0 h-full mx-[-1px] flex flex-col shadow-2xl"
                    >
                        <div
                            className={clsx('flex gap-4 flex-col max-w-full h-full w-full p-4 pt-5', {
                                'overflow-y-auto': snap === 1,
                                'overflow-hidden': snap !== 1,
                            })}
                        >
                            <Drawer.Title className="text-2xl text-foreground mt-2 font-bold tracking-tight">{currentHotspot?.title}</Drawer.Title>
                            <div className="flex items-center mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">
                                {currentHotspot?.description}
                            </div>

                            {currentHotspot?.address && (
                                <div className="flex items-center mt-2 text-sm md:text-base text-muted-foreground font-medium">
                                    <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-primary" />
                                    <span className="truncate text-foreground">{currentHotspot.address}</span>
                                </div>
                            )}
                            <div
                                className={`${panoramas.length > 0 ? "opacity-100" : "hidden"} w-full overflow-hidden transition-all duration-300 ease-in-out max-h-32 opacity-100`}
                            >
                                <div className="w-full flex flex-col items-center justify-center px-2 py-4">
                                    <div className="px-12 lg:px-16 w-full">
                                        <Carousel className="h-16 md:h-20 w-full max-w-full md:max-w-md lg:max-w-[60vw] mx-auto">
                                            <CarouselContent className="-ml-2 md:-ml-4">
                                                {
                                                    panoramas?.map((panorama: Panorama) => {
                                                        return <CarouselItem
                                                            key={panorama.panorama_id}
                                                            className={`pl-2 relative md:pl-4 basis-1/3 lg:basis-1/6 cursor-pointer`}

                                                        >
                                                            <img src={panorama.preview_image} className="w-full h-full object-cover rounded-lg border border-border shadow-xs" />
                                                        </CarouselItem>
                                                    })
                                                }
                                            </CarouselContent>
                                            <CarouselPrevious className="bg-white/90 hover:bg-secondary border border-border text-foreground shadow-sm w-8 h-8 lg:w-10 lg:h-10" />
                                            <CarouselNext className="bg-white/90 hover:bg-secondary border border-border text-foreground shadow-sm w-8 h-8 lg:w-10 lg:h-10" />
                                        </Carousel>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between gap-2 right-[1rem] absolute right-0">


                                <Button
                                    onClick={() => {
                                        showMedia(currentHotspot?.click_panorama_id ?? "");
                                        closeDrawer();
                                    }}
                                    className='cursor-pointer font-bold border border-primary h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md'>
                                    <RiDirectionFill className='w-5 h-5' />
                                </Button>


                                <Button onClick={() => {
                                    setCurrentHotspot(null);

                                }} variant={"ghost"} className='cursor-pointer font-bold border border-border bg-secondary/80 hover:bg-secondary text-foreground h-10 w-10 rounded-full shadow-sm'>
                                    <X className="w-5 h-5 text-foreground" />
                                </Button>

                            </div>

                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        </AbsoluteWrapper>
    );
}
