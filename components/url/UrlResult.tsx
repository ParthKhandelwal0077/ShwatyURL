"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Copy, Share2, QrCode } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QRCode from '@/components/url/QRCode';

interface UrlResultProps {
  shortenedUrl: string;
}

const UrlResult = ({ shortenedUrl }: UrlResultProps) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  
  const shareUrl = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out my shortened URL',
          text: 'I shortened this URL with Shortlo',
          url: `https://${shortenedUrl}`
        });
      } catch (err) {
        console.error('Error sharing: ', err);
      }
    } else {
      // Fallback to copying to clipboard
      copyToClipboard();
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h3 className="text-xl font-medium mb-4 text-center">Your shortened URL is ready!</h3>
      
      <Tabs defaultValue="link" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="link">Link</TabsTrigger>
          <TabsTrigger value="qr">QR Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="link" className="space-y-4">
          <Card className="border-border/50 bg-background/80">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <a 
                  href={`https://${shortenedUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg md:text-xl font-medium text-primary hover:underline glow-sm"
                >
                  {shortenedUrl}
                </a>
                
                <div className="flex space-x-2">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={copyToClipboard}
                    className="hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={shareUrl}
                    className="hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <p className="text-sm text-muted-foreground text-center">
            Create a free account to track clicks and manage your links.
          </p>
        </TabsContent>
        
        <TabsContent value="qr">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-3 rounded-lg">
              <QRCode value={`https://${shortenedUrl}`} size={180} />
            </div>
            
            <Button variant="outline" className="glow-sm">
              <QrCode className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UrlResult;