import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DISMISSED_KEY = 'aso-keyword-worksheet-disclaimer-dismissed-v1';

export function Disclaimer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(DISMISSED_KEY)) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);

    try {
      sessionStorage.setItem(DISMISSED_KEY, 'true');
    } catch {
      // Ignore
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="flex items-center justify-between w-full px-8 py-3 border-b border-yellow-200 bg-yellow-50">
      <p className="max-w-6xl text-sm text-yellow-900">
        All data is stored locally in your browser. This app is not affiliated with, endorsed by, or associated with Appfigures or Apple. This tool is provided for informational and academic purposes only and does not constitute advice of any kind. The functionality and algorithms are based on assumptions that may be inaccurate.
      </p>

      <Button
        aria-label="Dismiss disclaimer"
        className="flex-shrink-0 w-6 h-6 text-yellow-900 hover:text-yellow-950 hover:bg-yellow-100"
        onClick={handleDismiss}
        size="icon"
        variant="ghost"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
