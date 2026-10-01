import { clsx } from 'clsx';
import type { Asset } from '@/types/asset.type';
import { Info, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Drawer } from 'vaul';

export default function AssetDrawerBlock({
    currentAsset,
    setCurrentAsset,
    snap
}: {
    currentAsset: Asset | null;
    setCurrentAsset: (asset: Asset | null) => void;
    showMedia: (mediaName: string) => void;
    snap: number | string | null;
}) {
    return (
        <div
            className={clsx('flex gap-4 flex-col max-w-full h-full w-full p-4 pt-5', {
                'overflow-y-auto': snap === 1,
                'overflow-hidden': snap !== 1,
            })}
        >
            <Drawer.Title className="px-4 text-2xl text-foreground mt-2 font-bold">
                {currentAsset?.title}
            </Drawer.Title>

            {/* Asset Image */}
            <div className="flex flex-col flex-reverse md:flex-row justify-center gap-8">
                <div className="flex w-full max-w-md flex-col">
                    <h2 className='font-bold flex gap-2 items-center text-xl sm:text-2xl py-2 text-foreground'>
                        <Info className="text-primary" />
                        Thông tin
                    </h2>

                    <div className='h-full overflow-auto rounded-2xl text-muted-foreground py-3 px-4 bg-secondary/70 border border-border'>
                        <p className="text-sm sm:text-base leading-relaxed font-normal">{currentAsset?.description}</p>
                    </div>
                </div>
                {currentAsset?.image_url && (
                    <div className="flex flex-col justify-center rounded-3xl overflow-hidden">
                        <h2 className='font-bold flex gap-2 items-center text-xl sm:text-2xl py-2 text-foreground'>
                            <Info className="text-primary" />
                            Hình ảnh
                        </h2>
                        <img
                            src={currentAsset.image_url}
                            alt={currentAsset.title}
                            className="w-auto h-[250px] object-cover rounded-3xl border border-border shadow-sm"
                        />
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-2 right-[1rem] absolute right-0">
                <Button
                    onClick={() => {
                        setCurrentAsset(null);
                    }}
                    variant="ghost"
                    className='cursor-pointer font-bold border border-border bg-secondary/80 hover:bg-secondary text-foreground h-10 w-10 rounded-full flex items-center justify-center'
                >
                    <X className="w-5 h-5 text-foreground" />
                </Button>
            </div>
        </div>
    );
}
