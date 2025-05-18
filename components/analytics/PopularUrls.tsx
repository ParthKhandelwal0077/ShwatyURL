import { ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PopularUrl {
  id: string;
  shortUrl: string;
  originalUrl: string;
  clicks: number;
}

interface PopularUrlsProps {
  urls: PopularUrl[];
  isLoading: boolean;
}

const PopularUrls = ({ urls, isLoading }: PopularUrlsProps) => {
  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const displayUrl = `${urlObj.hostname}${urlObj.pathname}`;
      return displayUrl.length > 40 ? displayUrl.substring(0, 37) + '...' : displayUrl;
    } catch {
      return url.length > 40 ? url.substring(0, 37) + '...' : url;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="animate-pulse text-muted-foreground">Loading popular URLs...</div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/50">
            <TableHead className="w-[5%]">Rank</TableHead>
            <TableHead className="w-[40%]">Original URL</TableHead>
            <TableHead className="w-[25%]">Short URL</TableHead>
            <TableHead className="w-[15%] text-right">Clicks</TableHead>
            <TableHead className="w-[15%] text-right">% of Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {urls.map((url, index) => {
            // Calculate percentage of total clicks
            const totalClicks = urls.reduce((total, url) => total + url.clicks, 0);
            const percentage = totalClicks > 0 ? (url.clicks / totalClicks) * 100 : 0;
            
            return (
              <TableRow key={url.id} className="hover:bg-muted/10">
                <TableCell className="font-medium">#{index + 1}</TableCell>
                <TableCell className="truncate max-w-xs">
                  <a 
                    href={url.originalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center space-x-1 hover:text-primary transition-colors"
                  >
                    <span className="truncate">{formatUrl(url.originalUrl)}</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                </TableCell>
                <TableCell>
                  <a 
                    href={`https://${url.shortUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-medium text-primary hover:underline glow-sm"
                  >
                    {url.shortUrl}
                  </a>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {url.clicks.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {percentage.toFixed(1)}%
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PopularUrls;