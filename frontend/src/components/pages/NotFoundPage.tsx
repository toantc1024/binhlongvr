import { Button } from "../ui/button";
import { BackgroundBeamsWithCollision } from "../ui/shadcn-io/background-beams-with-collision";
import { useNavigate } from 'react-router-dom'

export default function Component() {
    const navigate = useNavigate()
    return (
        <BackgroundBeamsWithCollision className="!h-screen">
            <div className="flex items-center h-screen px-4 z-20 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative">
                <div className="w-full space-y-6 text-center">
                    <div className="space-y-3">
                        <h1 className="text-8xl font-bold tracking-tighter sm:text-8xl transition-transform text-primary">
                            404
                        </h1>
                        <p className="text-muted-foreground font-normal">
                            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            navigate("/");
                        }}
                        className="inline-flex h-10 items-center rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-8 text-sm font-medium shadow-xs transition-colors cursor-pointer"
                    >
                        Trở về trang chủ
                    </Button>
                </div>
            </div>
        </BackgroundBeamsWithCollision>
    );
}
