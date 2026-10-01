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
  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="lg:border lg:rounded-full p-1 border-border gap-2 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
        {[SECTIONS_CONFIG[0], SECTIONS_CONFIG[1], SECTIONS_CONFIG[4]].map((section, index) => (
          <NavigationMenuItem key={index}>
            <NavigationMenuLink asChild>
              <Button
                variant="ghost"
                className={`rounded-full cursor-pointer transition-all ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground font-medium shadow-xs hover:bg-primary/90 hover:text-primary-foreground"
                    : "text-foreground/80 hover:text-foreground hover:bg-secondary/80 font-medium"
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
