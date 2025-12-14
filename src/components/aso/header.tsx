import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onUseDemoData: () => void;
}

export function Header({ onReset, onUseDemoData }: HeaderProps) {
  return (
    <header className="w-full h-16 flex items-center justify-between px-4 border-b">
      <div className="font-semibold text-lg">
        ASO Keyword Worksheet
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
        >
          Reset
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onUseDemoData}
        >
          Use Demo Data
        </Button>
        <a
          href="https://github.com/rbenj/rapidprotokit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>
    </header>
  );
}
