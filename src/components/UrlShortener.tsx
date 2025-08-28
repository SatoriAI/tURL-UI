import { useState } from 'react';
import { Link, Copy, Check, Loader2, Zap, Search, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';

interface ShortenedUrl {
  original: string;
  short: string;
  lifetime: string;
  createdAt: Date;
}

interface UrlStatus {
  original: string;
  short: string;
  lifetime: string;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
  daysRemaining: number;
}

const UrlShortener = () => {
  const [url, setUrl] = useState('');
  const [lifetime, setLifetime] = useState('30');
  const [urlLength, setUrlLength] = useState('6');
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null);
  const [copied, setCopied] = useState(false);
  
  // URL Checker states
  const [checkUrl, setCheckUrl] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [urlStatus, setUrlStatus] = useState<UrlStatus | null>(null);
  const [extendLifetime, setExtendLifetime] = useState('30');
  const [isExtending, setIsExtending] = useState(false);
  
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

  const generateShortUrl = (length: string) => {
    // Mock short URL generation with specified length
    const lengthNum = parseInt(length);
    const randomId = Math.random().toString(36).substring(2, 2 + lengthNum);
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
    
    const shortUrl = generateShortUrl(urlLength);
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

  const handleCheckUrl = async () => {
    if (!checkUrl) {
      toast({
        title: t('error'),
        description: t('pleaseEnterUrl'),
        variant: 'destructive',
      });
      return;
    }

    if (!checkUrl.includes('turl.co/')) {
      toast({
        title: t('error'),
        description: t('pleaseEnterValidUrl'),
        variant: 'destructive',
      });
      return;
    }

    setIsChecking(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock URL status check
    const mockCreatedDate = new Date();
    mockCreatedDate.setDate(mockCreatedDate.getDate() - Math.floor(Math.random() * 20));
    
    const isActive = Math.random() > 0.2; // 80% chance of being active
    const daysRemaining = isActive ? Math.floor(Math.random() * 25) + 1 : 0;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + daysRemaining);
    
    const mockStatus: UrlStatus = {
      original: `https://example${Math.floor(Math.random() * 100)}.com/very/long/url/path`,
      short: checkUrl,
      lifetime: '30',
      createdAt: mockCreatedDate,
      expiresAt,
      isActive,
      daysRemaining,
    };

    setUrlStatus(mockStatus);
    setIsChecking(false);
    
    toast({
      title: t('success'),
      description: isActive ? t('urlStatus') : t('urlNotFound'),
      variant: isActive ? 'default' : 'destructive',
    });
  };

  const handleExtendLifetime = async () => {
    if (!urlStatus) return;

    setIsExtending(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const additionalDays = extendLifetime === 'forever' ? 99999 : parseInt(extendLifetime);
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + urlStatus.daysRemaining + additionalDays);
    
    const updatedStatus: UrlStatus = {
      ...urlStatus,
      lifetime: extendLifetime,
      expiresAt: newExpiresAt,
      daysRemaining: urlStatus.daysRemaining + additionalDays,
      isActive: true,
    };

    setUrlStatus(updatedStatus);
    setIsExtending(false);
    
    toast({
      title: t('success'),
      description: t('lifetimeExtendedSuccessfully'),
    });
  };

  const lifetimeOptions = [
    { value: '1', label: t('1day') },
    { value: '7', label: t('7days') },
    { value: '30', label: t('30days') },
    { value: '365', label: t('1year') },
    { value: 'forever', label: t('forever') },
  ];

  const urlLengthOptions = [
    { value: '2', label: '2', availability: '100+' },
    { value: '4', label: '4', availability: '1M+' },
    { value: '6', label: '6', availability: '1T+' },
    { value: '8', label: '8', availability: '1000T+' },
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <label htmlFor="url-length-select" className="text-sm font-medium">
                {t('urlLength')}
              </label>
              <Select value={urlLength} onValueChange={setUrlLength} disabled={isLoading}>
                <SelectTrigger id="url-length-select" className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {urlLengthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{option.label} chars</span>
                        <span className="text-xs text-muted-foreground ml-4">
                          ({option.availability} available)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

      {/* URL Checker Section */}
      <div className="pt-8">
        <Separator className="mb-8" />
        
        <Card className="shadow-soft border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Search className="h-6 w-6 text-primary" />
              {t('checkUrlStatus')}
            </CardTitle>
            <CardDescription className="text-base">
              {t('checkExistingUrlDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="check-url-input" className="text-sm font-medium">
                {t('enterShortUrl')}
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="check-url-input"
                  type="url"
                  placeholder="https://turl.co/abc123"
                  value={checkUrl}
                  onChange={(e) => setCheckUrl(e.target.value)}
                  className="pl-10 h-12 text-base"
                  disabled={isChecking}
                />
              </div>
            </div>

            <Button
              onClick={handleCheckUrl}
              disabled={isChecking || !checkUrl}
              variant="outline"
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('checking')}
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  {t('checkStatus')}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* URL Status Result */}
        {urlStatus && (
          <Card className="shadow-soft border-border/50 animate-fade-in mt-6">
            <CardHeader>
              <CardTitle className="text-lg text-primary flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t('urlStatus')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t('status')}:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      urlStatus.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {urlStatus.isActive ? t('active') : t('expired')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('created')}:</span>
                    <span>{urlStatus.createdAt.toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('lifetime')}:</span>
                    <span>{lifetimeOptions.find(opt => opt.value === urlStatus.lifetime)?.label || urlStatus.lifetime}</span>
                  </div>
                  
                  {urlStatus.isActive && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('expiresIn')}:</span>
                      <span className="font-medium">
                        {urlStatus.daysRemaining} {urlStatus.daysRemaining === 1 ? t('day') : t('days')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="font-mono text-sm text-muted-foreground truncate mb-2">
                  {urlStatus.original}
                </p>
                <p className="font-mono text-lg font-semibold text-primary truncate">
                  {urlStatus.short}
                </p>
              </div>

              {urlStatus.isActive && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <label htmlFor="extend-lifetime-select" className="text-sm font-medium">
                      {t('newLifetime')}
                    </label>
                    <Select value={extendLifetime} onValueChange={setExtendLifetime} disabled={isExtending}>
                      <SelectTrigger id="extend-lifetime-select" className="h-12">
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
                    onClick={handleExtendLifetime}
                    disabled={isExtending}
                    variant="gradient"
                    className="w-full h-12 text-base font-semibold"
                    size="lg"
                  >
                    {isExtending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('extending')}
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {t('extendLifetime')}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UrlShortener;