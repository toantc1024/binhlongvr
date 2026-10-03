import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import type { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import { SECTIONS_CONFIG } from "@/constants/sections.constants";

interface NavMenuProps extends NavigationMenuProps {
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
}

export const NavMenu = ({ activeSection, onNavigate, ...props }: NavMenuProps) => {
  const navItems = [
    SECTIONS_CONFIG.find((s) => s.id === "hero"),
    SECTIONS_CONFIG.find((s) => s.id === "overview"),
    SECTIONS_CONFIG.find((s) => s.id === "about"),
    SECTIONS_CONFIG.find((s) => s.id === "contact"),
  ].filter(Boolean) as typeof SECTIONS_CONFIG;

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="flex items-center gap-1 sm:gap-2 border-0 rounded-none p-0 bg-transparent space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
        {navItems.map((section) => (
          <NavigationMenuItem key={section.id}>
            <NavigationMenuLink asChild>
              <Button
                variant="ghost"
                className={`rounded-md px-3.5 py-2 cursor-pointer transition-all ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90 hover:text-primary-foreground"
                    : "text-foreground/80 hover:text-foreground hover:bg-secondary font-medium"
                }`}
                onClick={() => onNavigate?.(section.id)}
              >
                {section.label}
              </Button>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
