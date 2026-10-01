import email3DIcon from "@/assets/3d-icons/email__binhlong-3d-icon.png";
import location3DIcon from "@/assets/3d-icons/location__binhlong-3d-icon.png";
import { TextAnimate } from "../magicui/text-animate";

export function ContactSection() {
    return (
        <section className="py-12 w-full px-4 sm:px-6 lg:px-8 mb-20">
            <div className="w-full">
                {/* Header: Align Left */}
                <div className="w-full mb-8">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground text-left">
                        <TextAnimate animation="blurIn" as="span">
                            Liên hệ với chúng tôi
                        </TextAnimate>
                    </h2>
                    <p className="mt-2 text-base text-muted-foreground text-left font-normal max-w-2xl">
                        Hãy kết nối để được tư vấn giải pháp, hỗ trợ nhanh chóng
                    </p>
                </div>

                {/* Left-Aligned Contact Cards */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email Card */}
                    <div className="text-left flex flex-col items-start p-6 sm:p-7 rounded-2xl bg-card border-0 shadow-md hover:shadow-xl transition-all">
                        <div className="h-20 w-20 flex items-center justify-start pointer-events-none -ml-2 -mt-2">
                            <img
                                src={email3DIcon}
                                alt="Email 3D"
                                className="w-full h-full object-contain filter drop-shadow-md"
                            />
                        </div>
                        <h3 className="mt-4 font-semibold text-xl text-foreground text-left">
                            Email
                        </h3>
                        <p className="mt-1.5 text-muted-foreground text-sm font-normal text-left leading-relaxed">
                            Bạn có thắc mắc hoặc góp ý? Hãy liên hệ với chúng tôi
                        </p>
                        <a
                            className="mt-4 font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors hover:underline text-left text-sm sm:text-base break-all"
                            href="mailto:ubnd.phuongbinhlong@dongnai.gov.vn"
                        >
                            ubnd.phuongbinhlong@dongnai.gov.vn
                        </a>
                    </div>

                    {/* Organization Card */}
                    <div className="text-left flex flex-col items-start p-6 sm:p-7 rounded-2xl bg-card border-0 shadow-md hover:shadow-xl transition-all">
                        <div className="h-20 w-20 flex items-center justify-start pointer-events-none -ml-2 -mt-2">
                            <img
                                src={location3DIcon}
                                alt="Location 3D"
                                className="w-full h-full object-contain filter drop-shadow-md"
                            />
                        </div>
                        <h3 className="mt-4 font-semibold text-xl text-foreground text-left">
                            Đơn vị thực hiện & Quản lý
                        </h3>
                        <div className="mt-1.5 text-muted-foreground text-sm space-y-1 text-left">
                            <p className="font-medium text-foreground text-left">
                                UBND Phường Bình Long
                            </p>
                            <p className="text-sm font-normal text-muted-foreground text-left">
                                Ủy ban Nhân dân Phường Bình Long, Thành phố Đồng Nai
                            </p>
                        </div>
                        <a
                            className="mt-4 font-normal text-muted-foreground hover:text-primary transition-colors hover:underline text-left text-sm"
                            href="https://maps.google.com/?q=UBND+Phường+Bình+Long,+Đồng+Nai"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Phường Bình Long, Thành phố Đồng Nai
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
