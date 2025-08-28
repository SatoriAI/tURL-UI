import { Github, Globe, Twitter } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const Footer = () => {
  const { t } = useLanguage();

  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/yourusername',
      label: 'GitHub',
    },
    {
      icon: Globe,
      href: 'https://yourdomain.com',
      label: t('personalWebsite'),
    },
    {
      icon: Twitter,
      href: 'https://twitter.com/yourusername',
      label: 'Twitter / X',
    },
  ];

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">tU</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {t('footerDescription')}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-smooth"
                aria-label={link.label}
              >
                <link.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border/40 text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 tURL. {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;