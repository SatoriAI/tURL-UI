import { useState } from 'react';
import { Moon, Sun, Globe, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage, type Language } from '@/hooks/useLanguage';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const handleDonate = () => {
    // PayPal donation link - replace with actual donation URL
    window.open('https://www.paypal.com/donate/?business=YOUR_PAYPAL_EMAIL&currency_code=USD', '_blank');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between py-4">
        <div 
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-smooth"
          onClick={() => window.location.reload()}
        >
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">tU</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            tURL
          </h1>
        </div>

        <nav className="flex items-center space-x-4">
          {/* Language Selector */}
          <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
            <SelectTrigger className="w-auto border-none bg-transparent gap-3">
              <Globe className="h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="pl">Polski</SelectItem>
            </SelectContent>
          </Select>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">{t('toggleTheme')}</span>
          </Button>

          {/* Donate Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDonate}
            className="flex items-center space-x-2 hover:bg-primary hover:text-primary-foreground transition-smooth"
          >
            <Heart className="h-4 w-4" />
            <span>{t('donate')}</span>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;