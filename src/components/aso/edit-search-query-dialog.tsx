import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import type { SearchQuery } from '@/lib/db';

interface EditSearchQueryDialogProps {
  searchQuery: SearchQuery | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (searchQuery: SearchQuery) => void;
}

export function EditSearchQueryDialog({
  searchQuery,
  open,
  onOpenChange,
  onSave,
}: EditSearchQueryDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [text, setText] = useState('');
  const [popularity, setPopularity] = useState('');
  const [competitiveness, setCompetitiveness] = useState('');

  // Update form when searchQuery changes
  useEffect(() => {
    if (searchQuery) {
      setText(searchQuery.text);
      setPopularity(searchQuery.popularity?.toString() || '');
      setCompetitiveness(searchQuery.competitiveness?.toString() || '');
    }
  }, [searchQuery]);

  const handleSave = () => {
    if (!searchQuery || !text.trim()) { return; }

    // Normalize searchQuery: lowercase, trim, and remove extra whitespace
    const normalizedText = text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

    // Parse popularity (0-100)
    const popularityValue = popularity.trim()
      ? Math.max(0, Math.min(100, parseInt(popularity.trim(), 10) || 0))
      : undefined;

    // Parse competitiveness (0-100)
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

  if (!searchQuery) { return null; }

  const SearchQueryForm = ({ className }: { className?: string }) => (
    <form
      className={cn('grid items-start gap-4', className)}
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="edit-search-query-text">Search Query Text</Label>
        <Input
          id="edit-search-query-text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Search query text"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-search-query-popularity">Popularity (0-100)</Label>
        <Input
          id="edit-search-query-popularity"
          type="number"
          min="0"
          max="100"
          value={popularity}
          onChange={e => setPopularity(e.target.value)}
          placeholder="Popularity (0-100)"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-search-query-competitiveness">Competitiveness (0-100)</Label>
        <Input
          id="edit-search-query-competitiveness"
          type="number"
          min="0"
          max="100"
          value={competitiveness}
          onChange={e => setCompetitiveness(e.target.value)}
          placeholder="Competitiveness (0-100)"
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
          <SearchQueryForm />
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
        <SearchQueryForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
