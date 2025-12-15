import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DISCLAIMER_DISMISSED_KEY = 'aso-disclaimer-dismissed';

export function Disclaimer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if disclaimer has been dismissed in this session
    const dismissed = sessionStorage.getItem(DISCLAIMER_DISMISSED_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem(DISCLAIMER_DISMISSED_KEY, 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-between px-8 py-3 bg-yellow-50 border-b border-yellow-200">
      <p className="max-w-6xl text-sm text-yellow-900">
        All data is stored locally in your browser. This app is not affiliated with, endorsed by, or associated with Appfigures or Apple. This tool is provided for informational and academic purposes only and does not constitute advice of any kind. The functionality and algorithms are based on assumptions that may be inaccurate.
      </p>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-6 w-6 flex-shrink-0 text-yellow-900 hover:text-yellow-950 hover:bg-yellow-100',
        )}
        onClick={handleDismiss}
        aria-label="Dismiss disclaimer"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
