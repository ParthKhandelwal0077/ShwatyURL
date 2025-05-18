"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

const SecurityForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (field: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'twoFactorEnabled' && value) {
      toast({
        title: "Two-factor authentication",
        description: "Please set up your authenticator app to enable 2FA.",
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new password and confirmation match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <div className="relative">
            <Input
              id="currentPassword"
              name="currentPassword"
              type={showPassword ? "text" : "password"}
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter your current password"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="glow-sm">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Password
          </Button>
        </div>
      </form>
      
      <Separator />
      
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="twoFactorEnabled" className="block">Enable 2FA</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Add an extra layer of security to your account with two-factor authentication.
              </p>
            </div>
            <Switch
              id="twoFactorEnabled"
              checked={formData.twoFactorEnabled}
              onCheckedChange={(checked) => handleSwitchChange('twoFactorEnabled', checked)}
            />
          </div>
        </div>
        
        {formData.twoFactorEnabled && (
          <div className="rounded-md bg-muted/50 p-4">
            <p className="text-sm">
              Two-factor authentication is set up. You will need to enter a code from your authenticator app when signing in.
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              Reconfigure 2FA
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityForm;