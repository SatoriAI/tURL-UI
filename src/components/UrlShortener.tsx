import { useState } from 'react';
import { Link, Copy, Check, Loader2, Zap, Search, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { apiService, extractCodeFromUrl } from '@/lib/api';

interface ShortenedUrl {
  original: string;
  short: string;
  lifetime: string;
  createdAt: Date;
}

interface UrlStatus {
  url: string;
  lifetime: number;
  registered: string;
  modified: string;
  expires_at: string;
  expires_in: number;
  expired: boolean;
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
  const [lastCheckedUrl, setLastCheckedUrl] = useState(''); // Store the URL that was checked
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

    try {
      const response = await apiService.shortenUrl(url, lifetime, urlLength);

      const newShortenedUrl: ShortenedUrl = {
        original: url,
        short: response.url,
        lifetime,
        createdAt: new Date(),
      };

      setShortenedUrl(newShortenedUrl);
      setUrl(''); // Clear the input after successful shortening

      toast({
        title: t('success'),
        description: t('urlShortenedSuccessfully'),
      });
    } catch (error) {
      console.error('URL shortening error:', error);
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : 'Failed to shorten URL. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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

    // Basic URL validation - should contain a domain and path
    if (!checkUrl.includes('/') || checkUrl.split('/').length < 3) {
      toast({
        title: t('error'),
        description: t('pleaseEnterValidUrl'),
        variant: 'destructive',
      });
      return;
    }

    setIsChecking(true);

    try {
      const status = await apiService.checkUrlStatus(checkUrl);

      setUrlStatus(status);
      setLastCheckedUrl(checkUrl); // Store the checked URL for display
      setCheckUrl(''); // Clear the input after successful check

      toast({
        title: t('success'),
        description: status.expired ? t('urlNotFound') : t('urlStatus'),
        variant: status.expired ? 'destructive' : 'default',
      });
    } catch (error) {
      console.error('URL check error:', error);
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : 'Failed to check URL status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleExtendLifetime = async () => {
    if (!urlStatus) return;

    // Check if we have a valid URL to extend
    if (!lastCheckedUrl || lastCheckedUrl.trim().length === 0) {
      toast({
        title: t('error'),
        description: 'No URL to extend. Please check a URL first.',
        variant: 'destructive',
      });
      return;
    }

    setIsExtending(true);

    try {
      // Extract the code from the last checked URL to extend
      const code = extractCodeFromUrl(lastCheckedUrl);
      const updatedStatus = await apiService.extendUrlLifetime(code, extendLifetime);
      setUrlStatus(updatedStatus);

      toast({
        title: t('success'),
        description: t('lifetimeExtendedSuccessfully'),
      });
    } catch (error) {
      console.error('URL extension error:', error);
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : 'Failed to extend lifetime. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExtending(false);
    }
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
                <SelectTrigger id="url-length-select" className="h-12 [&>span]:line-clamp-none [&>span]:whitespace-nowrap">
                  <SelectValue>
                    {urlLengthOptions.find(opt => opt.value === urlLength) && (
                      <span className="flex items-center">
                        <span>{urlLengthOptions.find(opt => opt.value === urlLength)?.label} characters</span>
                        <span className="text-xs text-muted-foreground ml-6">
                          ({urlLengthOptions.find(opt => opt.value === urlLength)?.availability} available)
                        </span>
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {urlLengthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="px-6 pl-8">
                      <div className="flex items-center justify-between w-full min-w-0">
                        <span>{option.label} characters</span>
                        <span className="text-xs text-muted-foreground ml-6 shrink-0">
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
                      !urlStatus.expired
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {!urlStatus.expired ? t('active') : t('expired')}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('created')}:</span>
                    <span>{new Date(urlStatus.registered).toLocaleDateString()}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('lifetime')}:</span>
                    <span>{urlStatus.lifetime === null ? t('infinite') : urlStatus.lifetime === 0 ? t('forever') : `${urlStatus.lifetime} days`}</span>
                  </div>

                  {!urlStatus.expired && urlStatus.expires_in > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('expiresIn')}:</span>
                      <span className="font-medium">
                        {urlStatus.expires_in} {urlStatus.expires_in === 1 ? t('day') : t('days')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="font-mono text-sm text-muted-foreground truncate mb-2">
                  {urlStatus.url}
                </p>
                <p className="font-mono text-lg font-semibold text-primary truncate">
                  {lastCheckedUrl}
                </p>
              </div>

              {!urlStatus.expired && (
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