"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, Filter } from 'lucide-react';
import UrlTable from '@/components/dashboard/UrlTable';
import UrlMobileCards from '@/components/dashboard/UrlMobileCards';
import { UrlData } from '@/lib/types';
import UrlShortenerForm from '@/components/url/UrlShortenerForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { toast } = useToast();
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch('/api/urls');
        if (!response.ok) {
          throw new Error('Failed to fetch URLs');
        }
        const data = await response.json();
        setUrls(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch URLs. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUrls();
  }, [toast]);
  
  const refreshUrls = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/urls');
      if (!response.ok) {
        throw new Error('Failed to fetch URLs');
      }
      const data = await response.json();
      setUrls(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch URLs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateUrl = async (url: string) => {
    try {
      const response = await fetch('/api/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          originalUrl: url,
          customExpiry: null // Using default 5-year expiry
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create URL');
      }

      const newUrl = await response.json();
      setUrls((prevUrls) => [newUrl, ...prevUrls]);
      
      toast({
        title: "Success",
        description: "URL shortened successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create short URL. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteUrl = async (id: string) => {
    try {
      const response = await fetch(`/api/urls?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete URL');
      }

      setUrls((prevUrls) => prevUrls.filter(url => url.id !== id));
      
      toast({
        title: "Success",
        description: "URL deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete URL. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const filteredUrls = urls.filter(url => 
    url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.shortSlug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold">Your URLs</h1>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search URLs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9"
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 border-0 glow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Short URL</DialogTitle>
                <DialogDescription>
                  Enter a long URL to generate a new short link.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <UrlShortenerForm onSubmit={handleCreateUrl} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { title: 'Total URLs', value: urls.length, color: 'from-teal-500 to-emerald-600' },
          { title: 'Total Clicks', value: urls.reduce((acc, url) => acc + url.clickCount, 0), color: 'from-purple-500 to-indigo-600' },
          { title: 'Active Links', value: urls.filter(url => {
            if (!url.expiresAt) return true;
            return new Date(url.expiresAt) > new Date();
          }).length, color: 'from-amber-500 to-orange-600' },
        ].map((stat, index) => (
          <Card key={index} className="border-border/50 bg-card/70 backdrop-blur-sm hover:border-primary/30 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}>
                {isLoading ? '—' : stat.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* URL Table (Desktop) and Cards (Mobile) */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Your Links</CardTitle>
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse text-muted-foreground">Loading your URLs...</div>
            </div>
          ) : filteredUrls.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No URLs found</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first short URL
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Short URL</DialogTitle>
                    <DialogDescription>
                      Enter a long URL to generate a new short link.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <UrlShortenerForm onSubmit={handleCreateUrl} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <UrlTable urls={filteredUrls} onDelete={handleDeleteUrl} refreshUrls={refreshUrls} />
              </div>
              
              {/* Mobile Card View */}
              <div className="md:hidden">
                <UrlMobileCards urls={filteredUrls} onDelete={handleDeleteUrl} refreshUrls={refreshUrls} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}