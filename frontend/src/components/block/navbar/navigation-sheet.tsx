import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";

interface NavigationSheetProps {
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
}

export const NavigationSheet = ({ activeSection, onNavigate }: NavigationSheetProps) => {
  return (
    <Sheet >
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full border-border text-foreground shadow-xs bg-white/90 hover:bg-secondary">
          <Menu className="h-5 w-5 text-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent className="z-[999] p-4 flex flex-col bg-white text-foreground border-l border-border shadow-2xl">
        <Logo />
        <NavMenu
          orientation="vertical"
          className="md:mt-6 gap-2 flex justify-start items-start"
          activeSection={activeSection}
          onNavigate={onNavigate}
        />
      </SheetContent>
    </Sheet>
  );
};
