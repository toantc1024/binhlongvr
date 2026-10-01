import { Logo } from "../navbar/logo";

const FooterSection = () => {
  return (
    <footer className="w-full border-t border-border bg-card/60 backdrop-blur-xs">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center items-center text-center">
        {/* Logo */}
        <Logo />
        <div className="h-4" />
        <p className="pt-2 text-center text-muted-foreground text-sm leading-relaxed max-w-2xl">
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="/"
            className="font-semibold text-primary hover:text-primary/80 hover:underline"
          >
            bandosobinhlong.vn
          </a>
          <br />
          BẢN QUYỀN THUỘC VỀ UBND PHƯỜNG BÌNH LONG, THÀNH PHỐ ĐỒNG NAI.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
