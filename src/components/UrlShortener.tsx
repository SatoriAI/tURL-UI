import { useState } from 'react';
import { Link, Copy, Check, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';

interface ShortenedUrl {
  original: string;
  short: string;
  lifetime: string;
  createdAt: Date;
}

const UrlShortener = () => {
  const [url, setUrl] = useState('');
  const [lifetime, setLifetime] = useState('30');
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const generateShortUrl = () => {
    // Mock short URL generation
    const randomId = Math.random().toString(36).substring(2, 8);
    return `https://turl.co/${randomId}`;
  };

  const handleShorten = async () => {
    if (!url) {
      toast({
        title: t('error'),
        description: t('pleaseEnterUrl'),
        variant: 'destructive',
      });
      return;
    }

    if (!isValidUrl(url)) {
      toast({
        title: t('error'),
        description: t('pleaseEnterValidUrl'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const shortUrl = generateShortUrl();
    const newShortenedUrl: ShortenedUrl = {
      original: url,
      short: shortUrl,
      lifetime,
      createdAt: new Date(),
    };

    setShortenedUrl(newShortenedUrl);
    setIsLoading(false);
    
    toast({
      title: t('success'),
      description: t('urlShortenedSuccessfully'),
    });
  };

  const handleCopy = async () => {
    if (shortenedUrl) {
      await navigator.clipboard.writeText(shortenedUrl.short);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: t('copied'),
        description: t('urlCopiedToClipboard'),
      });
    }
  };

  const lifetimeOptions = [
    { value: '1', label: t('1day') },
    { value: '7', label: t('7days') },
    { value: '30', label: t('30days') },
    { value: '365', label: t('1year') },
    { value: 'forever', label: t('forever') },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="shadow-soft border-border/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            {t('shortenYourUrl')}
          </CardTitle>
          <CardDescription className="text-base">
            {t('createShortLinksDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="url-input" className="text-sm font-medium">
              {t('enterUrl')}
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="url-input"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 h-12 text-base"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="lifetime-select" className="text-sm font-medium">
              {t('linkLifetime')}
            </label>
            <Select value={lifetime} onValueChange={setLifetime} disabled={isLoading}>
              <SelectTrigger id="lifetime-select" className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {lifetimeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleShorten}
            disabled={isLoading || !url}
            variant="gradient"
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('shortening')}
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                {t('shortenUrl')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Result Card */}
      {shortenedUrl && (
        <Card className="shadow-soft border-border/50 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg text-primary">{t('yourShortUrl')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm text-muted-foreground truncate">
                    {shortenedUrl.original}
                  </p>
                  <p className="font-mono text-lg font-semibold text-primary truncate">
                    {shortenedUrl.short}
                  </p>
                </div>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {t('lifetime')}: {lifetimeOptions.find(opt => opt.value === shortenedUrl.lifetime)?.label}
              </span>
              <span>
                {t('created')}: {shortenedUrl.createdAt.toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UrlShortener;