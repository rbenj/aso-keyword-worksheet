import { NotebookPen } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className || ''}`}>
      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
        <NotebookPen className="w-5 h-5 text-white" />
      </div>
      <div className="font-semibold text-lg">
        ASO Keyword Worksheet
      </div>
    </div>
  );
}
