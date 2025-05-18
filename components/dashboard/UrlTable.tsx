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
  QrCode 
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { format, isAfter } from 'date-fns';
import QRCode from 'react-qr-code';
import { Input } from '@/components/ui/input';

interface UrlTableProps {
  urls: UrlData[];
  onDelete: (id: string) => void;
  refreshUrls: () => void;
}

const UrlTable = ({ urls, onDelete, refreshUrls }: UrlTableProps) => {
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
      return displayUrl.length > 40 ? displayUrl.substring(0, 37) + '...' : displayUrl;
    } catch {
      return url.length > 40 ? url.substring(0, 37) + '...' : url;
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
    <TooltipProvider>
      <div className="rounded-md border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/50">
              <TableHead className="w-[35%]">Original URL</TableHead>
              <TableHead className="w-[20%]">Short URL</TableHead>
              <TableHead className="w-[10%] text-center">Clicks</TableHead>
              <TableHead className="w-[15%]">Expiry</TableHead>
              <TableHead className="w-[20%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {urls.map((url) => (
              <TableRow key={url.id} className="hover:bg-muted/10">
                <TableCell className="font-medium truncate max-w-xs">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a 
                        href={url.originalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center space-x-1 hover:text-primary transition-colors"
                      >
                        <span className="truncate">{formatUrl(url.originalUrl)}</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{url.originalUrl}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <a 
                    href={fullShortUrl(url.shortSlug)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-medium text-primary hover:underline glow-sm"
                  >
                    {fullShortUrl(url.shortSlug)}
                  </a>
                </TableCell>
                <TableCell className="text-center">
                  {url.clickCount.toLocaleString()}
                </TableCell>
                <TableCell>
                  {url.expiresAt ? (
                    <span className={isExpired(url.expiresAt.toString()) ? "text-destructive" : ""}>
                      {format(new Date(url.expiresAt), 'MMM d, yyyy')}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Never</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => copyToClipboard(url.shortSlug, url.id)}
                          className="h-8 w-8"
                        >
                          {copiedId === url.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy URL</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setQrUrl(fullShortUrl(url.shortSlug))}>
                          <QrCode className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Show QR Code</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditExpiryId(url.id); setNewExpiry(url.expiresAt ? new Date(url.expiresAt).toISOString().slice(0, 10) : ''); }}>
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Expiry</p>
                      </TooltipContent>
                    </Tooltip>
                    
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
    </TooltipProvider>
  );
};

export default UrlTable;