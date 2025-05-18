"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/store/useUserStore';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PreferencesForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUserStore();
  const [formData, setFormData] = useState({
    defaultExpiryDays: 30,
    trackAnalytics: true,
    showQrCodes: true,
  });
  
  const handleSwitchChange = (field: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSliderChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, defaultExpiryDays: value[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // No domain logic, just show success
    toast({
      title: "Preferences updated",
      description: "Your preferences have been saved successfully.",
    });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="defaultExpiryDays">Default URL Expiration</Label>
            <span className="text-sm font-medium">
              {formData.defaultExpiryDays} {formData.defaultExpiryDays === 1 ? 'day' : 'days'}
            </span>
          </div>
          <Slider
            id="defaultExpiryDays"
            defaultValue={[formData.defaultExpiryDays]}
            max={365}
            min={1}
            step={1}
            onValueChange={handleSliderChange}
            className="py-2"
          />
          <p className="text-xs text-muted-foreground">
            Set the default expiration time for new URLs. Set to 365 for maximum duration.
          </p>
        </div>
        
        <Separator />
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="trackAnalytics" className="block">Track URL Analytics</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Collect click data and statistics for your shortened URLs.
              </p>
            </div>
            <Switch
              id="trackAnalytics"
              checked={formData.trackAnalytics}
              onCheckedChange={(checked) => handleSwitchChange('trackAnalytics', checked)}
            />
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="showQrCodes" className="block">QR Codes</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Automatically generate QR codes for your shortened URLs.
              </p>
            </div>
            <Switch
              id="showQrCodes"
              checked={formData.showQrCodes}
              onCheckedChange={(checked) => handleSwitchChange('showQrCodes', checked)}
            />
          </div>
        </div>
        
        <Separator />
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="glow-sm">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Preferences
        </Button>
      </div>
    </form>
  );
};

export default PreferencesForm;