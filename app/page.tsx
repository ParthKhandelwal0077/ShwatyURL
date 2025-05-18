"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, LinkIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
export default function Welcome() {
  const { data: session } = useSession();
  if (session) {
    redirect('/dashboard');
  }
  return (
    <div className="pt-20 pb-12">
      {/* Hero Section */}
      <section className="relative">
        {/* Background gradient effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 pt-12 pb-20 md:pt-24 md:pb-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 glow-md">
              Transform Your Links with ShwatyURL
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Create memorable short links and track their performance with powerful analytics.
            </p>
            
            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 glow-sm w-full sm:w-auto">
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Powerful URL Management
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Easy URL Shortening",
              description: "Transform long URLs into concise, memorable links with just a click."
            },
            {
              title: "Detailed Analytics",
              description: "Track clicks, locations, and devices with comprehensive analytics."
            },
            {
              title: "Secure & Reliable",
              description: "Your links are safe and always accessible when you need them."
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-card/40 backdrop-blur-sm border border-border/50 p-6 rounded-xl hover:shadow-lg transition-all hover:border-primary/30 hover:bg-card/60 group"
            >
              <div className="text-center">
                <div className="inline-block p-3 rounded-full bg-blue-500/10 mb-4">
                  <LinkIcon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}