import Link from 'next/link';
import { LinkIcon, Github, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background/50 backdrop-blur-sm border-t border-border/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <LinkIcon className="h-5 w-5 text-primary mr-2" />
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
              ShwatyURL
            </span>
          </div>
          
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Blog
            </Link>
          </div>
          
          <div className="flex space-x-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            © {currentYear} ShwatyURL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;