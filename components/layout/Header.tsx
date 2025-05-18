"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LinkIcon, BarChart3, Settings, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import { useUserStore } from '@/store/useUserStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { user, clearUser } = useUserStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { href: '/dashboard', label: 'Home', icon: <LinkIcon className="h-4 w-4 mr-2" />, showWhen: 'loggedIn' },
    { href: '/analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4 mr-2" />, showWhen: 'loggedIn' },
    { href: '/settings', label: 'Settings', icon: <Settings className="h-4 w-4 mr-2" />, showWhen: 'loggedIn' },
  ];

  const handleLogout = async () => {
    await signOut({ redirect: false });
    clearUser(); // Clear user data from store
    router.push('/');
  };

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href={session ? '/dashboard' : '/'} className="flex items-center">
          <LinkIcon className="h-6 w-6 text-primary mr-2 glow-sm" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            ShwatyURL
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks
            .filter(item => item.showWhen === 'always' || (item.showWhen === 'loggedIn' && session))
            .map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary bg-primary/10 glow-sm"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                <span className="flex items-center">
                  {link.icon}
                  {link.label}
                </span>
              </Link>
            ))
          }
          
          {session && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-4 hover:glow-sm">
                  Profile
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-muted-foreground">
                  {user?.email || session?.user?.email || 'User'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? 
            <X className="h-6 w-6 text-primary" /> : 
            <Menu className="h-6 w-6 text-primary" />
          }
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border animate-in slide-in-from-top">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            {navLinks
              .filter(item => item.showWhen === 'always' || (item.showWhen === 'loggedIn' && session))
              .map(link => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={cn(
                    "px-4 py-3 rounded-md text-sm font-medium transition-colors flex items-center",
                    pathname === link.href
                      ? "text-primary bg-primary/10 glow-sm"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  )}
                  onClick={toggleMobileMenu}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))
            }
            
            {session && (
              <div className="space-y-2 pt-2">
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  {user?.email || session?.user?.email || 'User'}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;