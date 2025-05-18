"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileForm from '@/components/settings/ProfileForm';
import PreferencesForm from '@/components/settings/PreferencesForm';
import SecurityForm from '@/components/settings/SecurityForm';
import { User2, Settings2, Shield, Bell } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-muted/50 border border-border/50">
          <TabsTrigger value="profile" className="flex items-center">
            <User2 className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center">
            <Settings2 className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center" disabled>
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="border-border/50 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card className="border-border/50 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>URL Preferences</CardTitle>
              <CardDescription>
                Customize your URL shortening experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PreferencesForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="border-border/50 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and secure your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SecurityForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}