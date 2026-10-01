import email3DIcon from "@/assets/3d-icons/email__binhlong-3d-icon.jpg";
import location3DIcon from "@/assets/3d-icons/location__binhlong-3d-icon.jpg";
import { TextAnimate } from "../magicui/text-animate";

export function ContactSection() {
    return (
        <section className="pt-8 px-4 sm:pt-12 sm:px-6 md:pt-16 mb-32 lg:px-8 flex w-full justify-center">
            <div className="container">
                <h2 className="py-8 text-2xl text-center font-bold md:text-4xl lg:text-5xl text-foreground">
                    <TextAnimate animation="blurIn" as="h1">
                        Liên hệ với chúng tôi
                    </TextAnimate>
                </h2>
                <p className="mt-4 text-base text-center sm:text-lg text-foreground/80 font-medium">
                    Hãy kết nối để được tư vấn giải pháp, hỗ trợ nhanh chóng
                </p>
                <div className="max-w-screen-xl mx-auto py-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 px-6 md:px-0">
                    {/* Email Card */}
                    <div className="text-center flex flex-col items-center p-6 rounded-2xl bg-white/90 border border-border shadow-xs hover:shadow-md transition-all">
                        <div className="h-16 w-16 overflow-hidden rounded-2xl shadow-sm border border-border flex items-center justify-center bg-secondary">
                            <img src={email3DIcon} alt="Email 3D" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="mt-5 font-bold text-xl text-foreground">Email</h3>
                        <p className="mt-2 text-foreground/80 font-medium">
                            Bạn có thắc mắc hoặc góp ý? Hãy liên hệ với chúng tôi
                        </p>
                        <a
                            className="mt-4 font-semibold text-foreground hover:text-primary transition-colors hover:underline"
                            href="mailto:thidoanbinhlong@binhphuoc.gov.vn"
                        >
                            thidoanbinhlong@binhphuoc.gov.vn
                        </a>
                    </div>

                    {/* Organization Card */}
                    <div className="text-center flex flex-col items-center p-6 rounded-2xl bg-white/90 border border-border shadow-xs hover:shadow-md transition-all">
                        <div className="h-16 w-16 overflow-hidden rounded-2xl shadow-sm border border-border flex items-center justify-center bg-secondary">
                            <img src={location3DIcon} alt="Location 3D" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="mt-5 font-bold text-xl text-foreground">Đơn vị thực hiện & Quản lý</h3>
                        <div className="mt-2 text-foreground/80 space-y-1">
                            <p className="font-semibold text-foreground">
                                Thị đoàn Bình Long
                            </p>
                            <p className="text-sm font-medium text-foreground/75">
                                Đoàn TNCS Hồ Chí Minh Thị xã Bình Long, Tỉnh Bình Phước
                            </p>
                        </div>
                        <a
                            className="mt-4 font-semibold text-foreground hover:text-primary transition-colors hover:underline max-w-lg text-sm"
                            href="https://maps.google.com/?q=Thị+Đoàn+Bình+Long,+Bình+Phước"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Đường Trần Hưng Đạo, P. An Lộc, TX. Bình Long, Tỉnh Bình Phước
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
