import React from 'react';

export default function ExpiredPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Link Expired</h1>
      <p className="text-lg text-muted-foreground mb-8">Sorry, this short link has expired and is no longer available.</p>
      <a href="/" className="text-primary underline">Go to Home</a>
    </div>
  );
} 