import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UrlShortener from '@/components/UrlShortener';
import { useLanguage } from '@/hooks/useLanguage';
import heroBg from '@/assets/hero-bg.jpg';

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section 
          className="relative py-20 px-4 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm"></div>
          <div className="relative container mx-auto text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
                {t('heroTitle')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {t('heroSubtitle')}
              </p>
              
              {/* URL Shortener Form */}
              <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <UrlShortener />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-gradient-secondary">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6 rounded-lg glass-effect animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Fast & Reliable</h3>
                <p className="text-muted-foreground">Lightning-fast URL shortening with 99.9% uptime guarantee</p>
              </div>
              
              <div className="p-6 rounded-lg glass-effect animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">🔒</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure</h3>
                <p className="text-muted-foreground">Advanced security measures to protect your links and data</p>
              </div>
              
              <div className="p-6 rounded-lg glass-effect animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">⏰</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Custom Lifetimes</h3>
                <p className="text-muted-foreground">Set custom expiration dates for your shortened URLs</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;