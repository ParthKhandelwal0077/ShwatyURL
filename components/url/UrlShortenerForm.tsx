"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LinkIcon } from 'lucide-react';

interface UrlShortenerFormProps {
  onSubmit: (url: string) => void;
}

const UrlShortenerForm = ({ onSubmit }: UrlShortenerFormProps) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateUrl = (value: string) => {
    try {
      // Check if URL is valid
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous error
    setError('');
    
    // Validate URL
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    if (!validateUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // In a real app, this would call an API to shorten the URL
      // Simulate API call with timeout
      setTimeout(() => {
        onSubmit(url);
        setIsLoading(false);
        setUrl('');
      }, 800);
    } catch (err) {
      setError('Failed to shorten URL. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div>
        <label htmlFor="url" className="text-sm font-medium text-muted-foreground mb-2 block text-left">
          Paste your long URL
        </label>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <div className="flex-grow relative">
            <Input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/your/very/long/url"
              className="w-full bg-background/50 border-border/60 pl-9 focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <LinkIcon className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 border-0 shadow-sm glow-sm"
          >
            {isLoading ? 'Shortening...' : 'Shorten URL'}
          </Button>
        </div>
        {error && (
          <p className="text-destructive text-sm mt-2 text-left">{error}</p>
        )}
      </div>
    </form>
  );
};

export default UrlShortenerForm;