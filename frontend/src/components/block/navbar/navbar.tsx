import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { Search } from "lucide-react";
import MapDialogBlock from "../MapDialogBlock";
import { useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import useVRStore from "@/store/vr.store";

interface NavbarProps {
  ref: React.RefObject<HTMLElement | null>;
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
}

const Navbar = ({ ref, activeSection, onNavigate }: NavbarProps) => {
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { setIsLoading } = useVRStore((state) => state);
  return (
    <>
      <MapDialogBlock
        opened={isMapDialogOpen}
        showMedia={(item) => {
          navigate({
            pathname: "/app",
            search: createSearchParams({
              panorama_id: item,
            }).toString(),
          });
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
          }, 5000);
        }}
        setOpened={setIsMapDialogOpen}
      />
      <header
        ref={ref}
        className="fixed top-0 left-0 right-0 w-full h-16 bg-background/95 border-b border-border z-[40] shadow-xs backdrop-blur-md rounded-none"
      >
        <div className="h-full w-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop Menu */}
          <NavMenu
            className="hidden md:block"
            activeSection={activeSection}
            onNavigate={onNavigate}
          />

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsMapDialogOpen(true)}
              size="lg"
              className="px-4 cursor-pointer rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium shadow-xs transition-all"
            >
              <div className="hidden sm:flex items-center gap-2">
                Tìm kiếm địa điểm <Search className="!h-4 !w-4" />
              </div>
              <div className="sm:hidden flex items-center gap-2">
                Tìm kiếm <Search className="!h-4 !w-4" />
              </div>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
