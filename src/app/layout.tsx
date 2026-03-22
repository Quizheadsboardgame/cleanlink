import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { ScrollingBanner } from "@/components/scrolling-banner";
import { ReviewTasksFab } from "@/components/review-tasks-fab";
import { LanguageProvider } from "@/context/language-context";
import { ManagerProvider } from "@/context/manager-context";
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'My Tidy Tracker | Professional Management',
  description: 'A professional web application for infrastructure and stock management, powered by Harley: work smarter.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'My Tidy Tracker',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0c',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground selection:bg-primary/30" suppressHydrationWarning>
        <FirebaseClientProvider>
          <Suspense fallback={null}>
            <ManagerProvider>
              <LanguageProvider>
                <ScrollingBanner />
                {children}
                <ReviewTasksFab />
                <Toaster />
              </LanguageProvider>
            </ManagerProvider>
          </Suspense>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
