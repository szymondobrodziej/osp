'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Clock, Users, AlertTriangle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RotationTimerProps {
  onRotationChange?: (rotation: 1 | 2 | null) => void;
}

export default function RotationTimer({ onRotationChange }: RotationTimerProps) {
  const [activeRotation, setActiveRotation] = useState<1 | 2 | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  // Timer
  useEffect(() => {
    if (activeRotation === null) {
      setElapsedSeconds(0);
      setIsWarning(false);
      setIsCritical(false);
      return;
    }

    const interval = setInterval(() => {
      setElapsedSeconds(prev => {
        const newValue = prev + 1;
        
        // Ostrzeżenie po 15 minutach (900s)
        if (newValue >= 900 && newValue < 1200) {
          setIsWarning(true);
          setIsCritical(false);
        }
        // Krytyczne po 20 minutach (1200s)
        else if (newValue >= 1200) {
          setIsWarning(false);
          setIsCritical(true);
        }
        
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeRotation]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRotationClick = (rotation: 1 | 2) => {
    if (activeRotation === rotation) {
      // Kliknięcie na aktywną rotację - reset
      setActiveRotation(null);
      setElapsedSeconds(0);
      onRotationChange?.(null);
    } else {
      // Zmiana rotacji
      setActiveRotation(rotation);
      setElapsedSeconds(0);
      setIsWarning(false);
      setIsCritical(false);
      onRotationChange?.(rotation);
    }
  };

  const handleReset = () => {
    setElapsedSeconds(0);
    setIsWarning(false);
    setIsCritical(false);
  };

  return (
    <Card className={cn(
      'p-3 transition-all duration-300',
      isCritical && 'border-red-600 bg-red-50 animate-pulse',
      isWarning && !isCritical && 'border-orange-500 bg-orange-50'
    )}>
      <div className="flex items-center gap-3 flex-wrap">
        {/* Label */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">Rotacja:</span>
        </div>

        {/* Rotation Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => handleRotationClick(1)}
            className={cn(
              'h-9 px-4 font-bold transition-all',
              activeRotation === 1
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            )}
          >
            1 ROTA
          </Button>
          <Button
            onClick={() => handleRotationClick(2)}
            className={cn(
              'h-9 px-4 font-bold transition-all',
              activeRotation === 2
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            )}
          >
            2 ROTA
          </Button>
        </div>

        {/* Timer - pokazuje się gdy aktywna rotacja */}
        {activeRotation !== null && (
          <>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded border">
              <Clock className={cn(
                'w-4 h-4',
                isCritical ? 'text-red-600' : isWarning ? 'text-orange-600' : 'text-gray-600'
              )} />
              <span className={cn(
                'font-mono font-bold text-base',
                isCritical ? 'text-red-600' : isWarning ? 'text-orange-600' : 'text-gray-900'
              )}>
                {formatTime(elapsedSeconds)}
              </span>
            </div>

            {/* Warning/Critical Badge */}
            {isWarning && !isCritical && (
              <Badge className="bg-orange-500 animate-pulse">
                <AlertTriangle className="w-3 h-3 mr-1" />
                15+ min
              </Badge>
            )}
            {isCritical && (
              <Badge className="bg-red-600 animate-pulse">
                <AlertTriangle className="w-3 h-3 mr-1" />
                20+ min - ZMIEŃ ROTĘ!
              </Badge>
            )}

            {/* Reset Button */}
            <Button
              onClick={handleReset}
              size="sm"
              variant="outline"
              className="h-9 px-3"
              title="Resetuj timer"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Info gdy brak aktywnej rotacji */}
        {activeRotation === null && (
          <span className="text-xs text-gray-500">
            Wybierz rotę w aparatach
          </span>
        )}
      </div>
    </Card>
  );
}

