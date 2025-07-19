import { NavLink } from "react-router-dom";
import { 
  Code, 
  FileType, 
  Link, 
  Hash,
  Settings,
  Menu,
  X
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { name: "JSON Formatter", href: "/", icon: Code },
  { name: "Base64 Tools", href: "/base64", icon: FileType },
  { name: "URL Encoder", href: "/url", icon: Link },
  { name: "Hash Generator", href: "/hash", icon: Hash },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/40 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-glow-pulse">
                Dev Toolbox
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item, index) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-300 hover-scale group relative overflow-hidden ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`
                  }
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <item.icon className="mr-2 h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  {item.name}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                </NavLink>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              
              {/* Settings Button */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center hover-scale transition-all duration-300 group"
              >
                <Settings className="h-4 w-4 transition-transform group-hover:rotate-90 duration-300" />
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="relative h-6 w-6">
                  <Menu className={`h-6 w-6 transition-all duration-300 ${isMenuOpen ? 'rotate-180 scale-0' : 'rotate-0 scale-100'} absolute inset-0`} />
                  <X className={`h-6 w-6 transition-all duration-300 ${isMenuOpen ? 'rotate-0 scale-100' : 'rotate-180 scale-0'} absolute inset-0`} />
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen 
            ? 'max-h-96 opacity-100 border-t border-border/40' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navigationItems.map((item, index) => (
              <NavLink
                key={item.name}
                to={item.href}
                end
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-300 hover-scale group ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`
                }
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <item.icon className="mr-3 h-4 w-4 transition-transform group-hover:scale-110" />
                {item.name}
              </NavLink>
            ))}
            
            <div className="pt-2 border-t border-border/40">
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3 text-sm hover-scale group"
              >
                <Settings className="mr-3 h-4 w-4 transition-transform group-hover:rotate-90" />
                Settings
              </Button>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}