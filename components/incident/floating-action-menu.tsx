'use client';

import { useState } from 'react';
import {
  Plus,
  X,
  Phone,
  Users,
  Truck,
  Camera,
  StickyNote,
  AlertTriangle,
  MapPin,
  Radio,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FloatingActionMenuProps {
  onAddCasualty?: () => void;
  onAddResource?: () => void;
  onAddNote?: () => void;
  onTakePhoto?: () => void;
  onEmergencyCall?: () => void;
  onRequestBackup?: () => void;
  onShowMap?: () => void;
  onRadioCheck?: () => void;
}

export default function FloatingActionMenu({
  onAddCasualty,
  onAddResource,
  onAddNote,
  onTakePhoto,
  onEmergencyCall,
  onRequestBackup,
  onShowMap,
  onRadioCheck,
}: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Phone,
      label: 'Połączenie alarmowe',
      onClick: onEmergencyCall,
      color: 'bg-red-600 hover:bg-red-700',
      show: true,
    },
    {
      icon: AlertTriangle,
      label: 'Wezwij wsparcie',
      onClick: onRequestBackup,
      color: 'bg-orange-600 hover:bg-orange-700',
      show: true,
    },
    {
      icon: Users,
      label: 'Dodaj poszkodowanego',
      onClick: onAddCasualty,
      color: 'bg-purple-600 hover:bg-purple-700',
      show: !!onAddCasualty,
    },
    {
      icon: Truck,
      label: 'Dodaj zasób',
      onClick: onAddResource,
      color: 'bg-blue-600 hover:bg-blue-700',
      show: !!onAddResource,
    },
    {
      icon: StickyNote,
      label: 'Szybka notatka',
      onClick: onAddNote,
      color: 'bg-yellow-600 hover:bg-yellow-700',
      show: !!onAddNote,
    },
    {
      icon: Camera,
      label: 'Zrób zdjęcie',
      onClick: onTakePhoto,
      color: 'bg-green-600 hover:bg-green-700',
      show: !!onTakePhoto,
    },
    {
      icon: MapPin,
      label: 'Pokaż mapę',
      onClick: onShowMap,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      show: !!onShowMap,
    },
    {
      icon: Radio,
      label: 'Sprawdzenie łączności',
      onClick: onRadioCheck,
      color: 'bg-teal-600 hover:bg-teal-700',
      show: !!onRadioCheck,
    },
  ].filter(action => action.show);

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50">
        {/* Action buttons - pokazują się gdy menu otwarte */}
        <div
          className={cn(
            'flex flex-col-reverse gap-3 mb-3 transition-all duration-300',
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          )}
        >
          {actions.map((action, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    action.onClick?.();
                    setIsOpen(false);
                  }}
                  className={cn(
                    'h-14 w-14 rounded-full shadow-xl transition-all duration-200',
                    'hover:scale-110 active:scale-95',
                    action.color
                  )}
                  style={{
                    transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                  }}
                >
                  <action.icon className="w-6 h-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-sm font-medium">
                {action.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Main FAB button */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'h-16 w-16 rounded-full shadow-2xl transition-all duration-300',
            'hover:scale-110 active:scale-95',
            isOpen
              ? 'bg-gray-600 hover:bg-gray-700 rotate-45'
              : 'bg-red-600 hover:bg-red-700 rotate-0'
          )}
        >
          {isOpen ? (
            <X className="w-8 h-8" />
          ) : (
            <Plus className="w-8 h-8" />
          )}
        </Button>

        {/* Backdrop - zamyka menu po kliknięciu poza */}
        {isOpen && (
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </TooltipProvider>
  );
}

