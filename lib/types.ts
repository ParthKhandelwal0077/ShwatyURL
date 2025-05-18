export interface UrlData {
  id: string;
  userId: string;
  originalUrl: string;
  shortSlug: string;
  clickCount: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  domain?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface UserSettings {
  defaultExpiryDays: number;
  trackAnalytics: boolean;
}

export interface AnalyticsData {
  totalUrls: number;
  totalClicks: number;
  clicksByDay: {
    date: string;
    clicks: number;
  }[];
  popularUrls: {
    id: string;
    shortUrl: string;
    originalUrl: string;
    clicks: number;
  }[];
}