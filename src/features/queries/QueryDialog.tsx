import { useState, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';
import type { SearchQuery } from '@/lib/db';

import { useMediaQuery } from '@/hooks/use-media-query';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface QueryDialogProps {
  onOpenChange: (open: boolean) => void;
  onSave: (searchQuery: SearchQuery) => void;
  open: boolean;
  searchQuery: SearchQuery | null;
}

export function QueryDialog({
  onOpenChange,
  onSave,
  open,
  searchQuery,
}: QueryDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [text, setText] = useState('');
  const [popularity, setPopularity] = useState('');
  const [competitiveness, setCompetitiveness] = useState('');
  const initializedSearchQueryId = useRef<number | null>(null);

  useEffect(() => {
    if (open && searchQuery) {
      if (searchQuery.id !== initializedSearchQueryId.current) {
        setText(searchQuery.text);
        setPopularity(searchQuery.popularity?.toString() || '');
        setCompetitiveness(searchQuery.competitiveness?.toString() || '');
        initializedSearchQueryId.current = searchQuery.id;
      }
    }

    if (!open) {
      initializedSearchQueryId.current = null;
    }
  }, [open, searchQuery?.id, searchQuery]);

  const handleSave = () => {
    if (!searchQuery || !text.trim()) { return; }

    const normalizedText = text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

    const popularityValue = popularity.trim()
      ? Math.max(0, Math.min(100, parseInt(popularity.trim(), 10) || 0))
      : undefined;

    const competitivenessValue = competitiveness.trim()
      ? Math.max(0, Math.min(100, parseInt(competitiveness.trim(), 10) || 0))
      : undefined;

    onSave({
      ...searchQuery,
      text: normalizedText,
      popularity: popularityValue,
      competitiveness: competitivenessValue,
    });

    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  if (!searchQuery) {
    return null;
  }

  const formContent = (
    <form
      className={cn('grid items-start gap-4')}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <Label htmlFor="edit-search-query-text">Search Query Text</Label>
        <Input
          id="edit-search-query-text"
          onChange={e => setText(e.target.value)}
          placeholder="Search query text"
          value={text}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-search-query-popularity">Popularity (0-100)</Label>
        <Input
          id="edit-search-query-popularity"
          max="100"
          min="0"
          onChange={e => setPopularity(e.target.value)}
          placeholder="Popularity (0-100)"
          type="number"
          value={popularity}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-search-query-competitiveness">Competitiveness (0-100)</Label>
        <Input
          id="edit-search-query-competitiveness"
          max="100"
          min="0"
          onChange={e => setCompetitiveness(e.target.value)}
          placeholder="Competitiveness (0-100)"
          type="number"
          value={competitiveness}
        />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit search query</DialogTitle>
            <DialogDescription>
              Make changes to your search query here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit search query</DrawerTitle>
          <DrawerDescription>
            Make changes to your search query here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          {formContent}
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
