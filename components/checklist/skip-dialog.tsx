'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { XCircle } from 'lucide-react';

interface SkipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  itemTitle: string;
}

export default function SkipDialog({
  open,
  onOpenChange,
  onConfirm,
  itemTitle,
}: SkipDialogProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason('');
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-orange-500" />
            Pomiń zadanie
          </DialogTitle>
          <DialogDescription>
            Podaj powód pominięcia zadania: <strong>{itemTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Np. Brak odpowiedniego sprzętu, warunki pogodowe, itp..."
            className="min-h-[100px]"
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-2">
            Powód zostanie zapisany w raporcie z akcji
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Anuluj
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Pomiń zadanie
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

