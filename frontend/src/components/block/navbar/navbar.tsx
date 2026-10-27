import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { Search, Compass } from "lucide-react";
import MapDialogBlock from "../MapDialogBlock";
import { createSearchParams, useNavigate } from "react-router-dom";
import useVRStore from "@/store/vr.store";

interface NavbarProps {
  ref: React.RefObject<HTMLElement | null>;
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
}

const Navbar = ({ ref, activeSection, onNavigate }: NavbarProps) => {
  const navigate = useNavigate();
  const {
    setIsLoading,
    isMapDialogOpen,
    setIsMapDialogOpen,
    mapDialogHotspotId,
    selectHotspotAndPanorama,
    setIsWelcomeDialogOpen,
  } = useVRStore((state) => state);
  return (
    <>
      <MapDialogBlock
        opened={isMapDialogOpen}
        initialHotspotId={mapDialogHotspotId}
        showMedia={(item, hotspotId) => {
          selectHotspotAndPanorama(hotspotId, item);
          navigate({
            pathname: "/app",
            search: createSearchParams({
              panorama_id: item,
              ...(hotspotId ? { hotspot_id: String(hotspotId) } : {}),
            }).toString(),
          });
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
          }, 300);
        }}
        setOpened={(open) => setIsMapDialogOpen(open)}
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

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              onClick={() => setIsWelcomeDialogOpen(true)}
              variant="outline"
              size="lg"
              className="px-3 sm:px-4 cursor-pointer rounded-lg border-border hover:bg-secondary text-foreground text-sm font-semibold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Compass className="!h-4 !w-4 text-emerald-600" />
              <span className="hidden sm:inline">Điểm tham quan</span>
              <span className="sm:hidden">Địa điểm</span>
            </Button>

            <Button
              onClick={() => setIsMapDialogOpen(true)}
              size="lg"
              className="px-3.5 sm:px-4 cursor-pointer rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium shadow-xs transition-all"
            >
              <div className="hidden sm:flex items-center gap-2">
                Tìm kiếm <Search className="!h-4 !w-4" />
              </div>
              <div className="sm:hidden flex items-center gap-2">
                <Search className="!h-4 !w-4" />
              </div>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
