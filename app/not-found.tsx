import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LinkIcon, FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-16 px-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-8">
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col items-center space-y-4">
          <Button asChild size="lg" className="glow-sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back home
            </Link>
          </Button>
          
          <div className="text-sm text-muted-foreground">
            If you think this is an error, please{' '}
            <Link href="/contact" className="text-primary hover:underline">
              contact support
            </Link>
          </div>
        </div>
        
        <div className="mt-10">
          <Link href="/" className="inline-flex items-center">
            <LinkIcon className="h-5 w-5 text-primary mr-2" />
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
              Shortlo
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}