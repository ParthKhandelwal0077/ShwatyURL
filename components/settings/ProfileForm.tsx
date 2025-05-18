"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserStore } from '@/store/useUserStore';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ProfileForm = () => {
  const { user, setUser } = useUserStore();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    image: user?.image || '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Implement image upload to your storage service
    // For now, we'll just use a placeholder
    const imageUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setUser(data);
      
      toast({
        title: "Profile updated",
        description: data.message || "Your profile information has been updated successfully.",
      });

      // If email was changed, sign out and redirect to login
      if (data.email !== user?.email) {
        await signOut({ redirect: false });
        router.push('/login');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={formData.image || '../../assets/Grok Image.jpg'} alt="User avatar" />
          <AvatarFallback>{formData.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <Button 
            variant="outline" 
            type="button" 
            size="sm"
            onClick={() => document.getElementById('avatar')?.click()}
          >
            Change Avatar
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            JPG, PNG or GIF. 1MB max.
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>
        
        {/* <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
          />
          <p className="text-xs text-muted-foreground">
            Will be used for your profile URL: shortlo.com/user/{formData.username}
          </p>
        </div> */}
        
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="glow-sm">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;