
import { Button } from '../ui/button'
import DialogWrapper from './DialogWrapper'
import { PiQuestionFill } from 'react-icons/pi'
import {
    FiHome,
    FiSearch,
    FiShare2,
    FiChevronLeft,
    FiChevronRight,
    FiChevronUp,
    FiInfo
} from 'react-icons/fi'
import { Volume2 } from 'lucide-react'
import { RiGlobalFill } from 'react-icons/ri'
import { PiInfoFill } from 'react-icons/pi'

const TutorialDialogBlock = () => {
    return (
        <DialogWrapper
            trigger={
                <Button
                    variant="ghost"
                    className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 shadow-xs rounded-full hover:bg-secondary bg-white/95 text-foreground border border-border flex items-center justify-center cursor-pointer transition-all active:scale-95"
                    title="Hướng dẫn sử dụng"
                    aria-label="Hướng dẫn sử dụng"
                >
                    <PiQuestionFill className="!size-6 sm:!size-7 text-foreground" />
                </Button>
            }
            showHeader={true}
            headerIcon={<PiQuestionFill className='text-foreground' />}
            title="Hướng dẫn sử dụng"
            description="Tìm hiểu các chức năng điều khiển trong không gian thực tế ảo"
            showCloseButton={true}
            showFooter={false}
            size="xl"
            mobileSize="lg"
            useCustomScrollbar={true}
        >
            <div className="space-y-6 sm:space-y-8">
                {/* Left Navigation */}
                <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-foreground font-bold text-lg sm:text-xl flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-secondary flex items-center justify-center">
                            <FiHome className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
                        </div>
                        Điều hướng bên trái
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/70 rounded-xl border border-border">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                                <RiGlobalFill className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-foreground font-bold text-sm sm:text-base">Về Website</p>
                                <p className="text-muted-foreground text-xs sm:text-sm">Trở về trang chủ website Bản đồ số Bình Long</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/70 rounded-xl border border-border">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                                <FiHome className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-foreground font-bold text-sm sm:text-base">Về toàn cảnh Mộ 3.000 người (Nút Home)</p>
                                <p className="text-muted-foreground text-xs sm:text-sm">Trở về toàn cảnh Di tích Lịch sử cấp Quốc gia Mộ 3.000 đồng bào bị Đế quốc Mỹ tàn sát ngày 03/10/1972 (Mộ tập thể 3000 người)</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/70 rounded-xl border border-border">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-foreground font-bold text-sm sm:text-base">Thuyết minh âm thanh</p>
                                <p className="text-muted-foreground text-xs sm:text-sm">Bật/tắt giọng đọc thuyết minh tự động theo từng di tích hiện tại</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/70 rounded-xl border border-border">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                                <PiQuestionFill className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-foreground font-bold text-sm sm:text-base">Trợ giúp</p>
                                <p className="text-muted-foreground text-xs sm:text-sm">Mở hướng dẫn sử dụng (đang xem)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Right Navigation */}
                <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-foreground font-bold text-lg sm:text-xl flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-secondary flex items-center justify-center">
                            <FiSearch className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
                        </div>
                        Điều hướng phía trên bên phải
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/70 rounded-xl border border-border">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                                <FiSearch className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-foreground font-bold text-sm sm:text-base">Tìm kiếm & Bản đồ số 3D</p>
                                <p className="text-muted-foreground text-xs sm:text-sm">Mở bản đồ số tương tác và tìm kiếm nhanh các di tích</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-foreground font-bold text-lg sm:text-xl flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-secondary flex items-center justify-center">
                            <FiChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
                        </div>
                        Điều hướng phía dưới
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/70 rounded-xl border border-border">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                                <span className="text-foreground text-xs sm:text-sm font-bold">360°</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-foreground font-bold text-sm sm:text-base">Bộ chọn Panorama</p>
                                <p className="text-muted-foreground text-xs sm:text-sm">Chọn panorama hiện tại từ danh sách</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/70 rounded-xl border border-border">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                                <PiInfoFill className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-foreground font-bold text-sm sm:text-base">Thông tin</p>
                                <p className="text-muted-foreground text-xs sm:text-sm">Xem thông tin chi tiết về địa điểm</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/70 rounded-xl border border-border">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                                <FiShare2 className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-foreground font-bold text-sm sm:text-base">Chia sẻ</p>
                                <p className="text-muted-foreground text-xs sm:text-sm">Chia sẻ địa điểm với bạn bè</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/70 rounded-xl border border-border">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                                <FiChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-foreground font-bold text-sm sm:text-base">Ẩn/Hiện Carousel</p>
                                <p className="text-muted-foreground text-xs sm:text-sm">Thu gọn hoặc mở rộng danh sách panorama</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panorama Carousel */}
                <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-foreground font-bold text-lg sm:text-xl flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-secondary flex items-center justify-center">
                            <FiChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
                        </div>
                        Carousel Panorama
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/70 rounded-xl border border-border">
                            <div className="flex gap-1">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-secondary border border-border flex items-center justify-center">
                                    <FiChevronLeft className="w-3 h-3 text-foreground" />
                                </div>
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-secondary border border-border flex items-center justify-center">
                                    <FiChevronRight className="w-3 h-3 text-foreground" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-foreground font-bold text-sm sm:text-base">Điều hướng trái/phải</p>
                                <p className="text-muted-foreground text-xs sm:text-sm">Di chuyển qua lại giữa các panorama</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/70 rounded-xl border border-border">
                            <div className="w-8 h-6 sm:w-10 sm:h-8 rounded bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                                <span className="text-foreground text-xs font-bold">IMG</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-foreground font-bold text-sm sm:text-base">Ảnh xem trước</p>
                                <p className="text-muted-foreground text-xs sm:text-sm">Nhấn vào ảnh để chuyển đến panorama đó</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* General Tips */}
                <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-foreground font-bold text-lg sm:text-xl flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-secondary flex items-center justify-center">
                            <FiInfo className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground" />
                        </div>
                        Mẹo sử dụng
                    </h3>
                    <div className="p-4 sm:p-5 bg-secondary/70 rounded-xl border border-border">
                        <ul className="space-y-2 sm:space-y-3 text-muted-foreground text-sm sm:text-base font-medium">
                            <li className="flex items-start gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                                <span>Kéo thả để xoay góc nhìn 360°</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                                <span>Nhấn vào các điểm hotspot để di chuyển</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                                <span>Sử dụng chatbot AI để tìm hiểu thêm về địa điểm</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                                <span>Pinch để zoom trên thiết bị di động</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </DialogWrapper>
    )
}

export default TutorialDialogBlock
