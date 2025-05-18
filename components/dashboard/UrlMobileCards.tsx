"use client";

import { useState } from 'react';
import { UrlData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  Copy, 
  Trash2, 
  Calendar, 
  ExternalLink, 
  Check, 
  QrCode,
  MousePointerClick
} from 'lucide-react';
import { format, isAfter } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import QRCode from 'react-qr-code';
import { Input } from '@/components/ui/input';

interface UrlMobileCardsProps {
  urls: UrlData[];
  onDelete: (id: string) => void;
  refreshUrls: () => void;
}

const UrlMobileCards = ({ urls, onDelete, refreshUrls }: UrlMobileCardsProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [editExpiryId, setEditExpiryId] = useState<string | null>(null);
  const [newExpiry, setNewExpiry] = useState<string>('');
  const [savingExpiry, setSavingExpiry] = useState(false);
  
  const getPrefix = () =>
    typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'localhost:3000'
      : 'shwatyurl.vercel.app';
  
  const fullShortUrl = (shortSlug: string) => `http://${getPrefix()}/${shortSlug}`;
  
  const copyToClipboard = async (shortSlug: string, id: string) => {
    try {
      await navigator.clipboard.writeText(fullShortUrl(shortSlug));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  
  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const displayUrl = `${urlObj.hostname}${urlObj.pathname}`;
      return displayUrl.length > 32 ? displayUrl.substring(0, 29) + '...' : displayUrl;
    } catch {
      return url.length > 32 ? url.substring(0, 29) + '...' : url;
    }
  };
  
  const isExpired = (date: string | null) => {
    if (!date) return false;
    return !isAfter(new Date(date), new Date());
  };

  const handleSaveExpiry = async (urlId: string) => {
    setSavingExpiry(true);
    try {
      const response = await fetch(`/api/urls?id=${urlId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiresAt: newExpiry }),
      });
      if (!response.ok) throw new Error('Failed to update expiry');
      setEditExpiryId(null);
      setNewExpiry('');
      refreshUrls();
    } catch (err) {
      alert('Failed to update expiry');
    } finally {
      setSavingExpiry(false);
    }
  };

  return (
    <div className="space-y-4">
      {urls.map((url) => (
        <Card key={url.id} className="border-border/50 bg-card/70 backdrop-blur-sm hover:border-primary/30 transition-all">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <a 
                  href={fullShortUrl(url.shortSlug)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-medium text-primary hover:underline text-lg glow-sm"
                >
                  {fullShortUrl(url.shortSlug)}
                </a>
                
                <div className="mt-1 flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs flex items-center bg-muted/30">
                    <MousePointerClick className="h-3 w-3 mr-1" />
                    {url.clickCount} clicks
                  </Badge>
                  
                  {url.expiresAt && (
                    <Badge 
                      variant={isExpired(url.expiresAt ? url.expiresAt.toString() : null) ? "destructive" : "outline"} 
                      className="text-xs bg-muted/30"
                    >
                      {isExpired(url.expiresAt ? url.expiresAt.toString() : null) ? 'Expired' : 'Expires'}: {format(new Date(url.expiresAt), 'MMM d')}
                    </Badge>
                  )}
                </div>
              </div>
              
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => copyToClipboard(url.shortSlug, url.id)}
              >
                {copiedId === url.id ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <Separator className="my-2" />
            
            <div className="mt-3">
              <p className="text-sm text-muted-foreground mb-1">Original URL:</p>
              <a 
                href={url.originalUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm flex items-center hover:text-primary transition-colors line-clamp-1"
              >
                <span className="truncate">{formatUrl(url.originalUrl)}</span>
                <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
              </a>
            </div>
          </CardContent>
          
          <CardFooter className="pt-2 pb-4 flex justify-between">
            <div className="text-xs text-muted-foreground">
              Created {format(new Date(url.createdAt), 'MMM d, yyyy')}
            </div>
            
            <div className="flex space-x-1">
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setQrUrl(fullShortUrl(url.shortSlug))}>
                <QrCode className="h-4 w-4" />
              </Button>
              
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditExpiryId(url.id); setNewExpiry(url.expiresAt ? new Date(url.expiresAt).toISOString().slice(0, 10) : ''); }}>
                <Calendar className="h-4 w-4" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete URL</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this URL? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDelete(url.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardFooter>
        </Card>
      ))}
      {qrUrl && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg flex flex-col items-center shadow-lg border border-border">
            <div className="bg-white p-4 rounded-md flex flex-col items-center">
              <QRCode value={qrUrl} size={180} bgColor="#fff" fgColor="#000" />
            </div>
            <div className="mt-4 text-sm break-all text-gray-900 dark:text-gray-100">{qrUrl}</div>
            <Button className="mt-4" onClick={() => setQrUrl(null)}>Close</Button>
          </div>
        </div>
      )}
      {editExpiryId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg flex flex-col items-center min-w-[320px] shadow-lg border border-border">
            <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">Set Expiry Date</h2>
            <Input
              type="date"
              value={newExpiry}
              onChange={e => setNewExpiry(e.target.value)}
              className="mb-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-border focus:ring-2 focus:ring-primary"
            />
            <div className="flex space-x-2">
              <Button onClick={() => handleSaveExpiry(editExpiryId)} disabled={savingExpiry || !newExpiry}>
                {savingExpiry ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => setEditExpiryId(null)} disabled={savingExpiry}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlMobileCards;