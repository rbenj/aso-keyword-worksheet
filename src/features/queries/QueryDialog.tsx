import { Query } from '@/models/Query';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { QueryForm } from './QueryForm';

interface QueryDialogProps {
  onClose: () => void;
  onUpdate: (query: Query) => void;
  query: Query | null;
}

export function QueryDialog({
  onClose,
  onUpdate,
  query,
}: QueryDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (!query) {
    return null;
  }

  const queryForm = (
    <QueryForm
      competitiveness={query.competitiveness}
      id={query.id}
      onSubmit={onUpdate}
      popularity={query.popularity}
      submitLabel="Save"
      text={query.text}
    />
  );

  if (isDesktop) {
    return (
      <Dialog open={!!query} onOpenChange={open => !open && onClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Search Query</DialogTitle>
            <DialogDescription>
              Click save when you're done editing.
            </DialogDescription>
          </DialogHeader>
          {queryForm}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={!!query} onOpenChange={open => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit Search Query</DrawerTitle>
          <DrawerDescription>
            Click save when you're done editing.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          {queryForm}
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
