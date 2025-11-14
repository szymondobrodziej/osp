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

  // Osobne timery dla każdej roty
  const [rotation1Seconds, setRotation1Seconds] = useState(0);
  const [rotation2Seconds, setRotation2Seconds] = useState(0);

  const [rotation1Running, setRotation1Running] = useState(false);
  const [rotation2Running, setRotation2Running] = useState(false);

  // Timer dla roty 1
  useEffect(() => {
    if (!rotation1Running) return;

    const interval = setInterval(() => {
      setRotation1Seconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [rotation1Running]);

  // Timer dla roty 2
  useEffect(() => {
    if (!rotation2Running) return;

    const interval = setInterval(() => {
      setRotation2Seconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [rotation2Running]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWarningState = (seconds: number) => {
    if (seconds >= 1200) return 'critical'; // 20+ min
    if (seconds >= 900) return 'warning';   // 15+ min
    return 'normal';
  };

  const handleRotationClick = (rotation: 1 | 2) => {
    if (rotation === 1) {
      if (rotation1Running) {
        // Stop roty 1
        setRotation1Running(false);
        setActiveRotation(rotation2Running ? 2 : null);
        onRotationChange?.(rotation2Running ? 2 : null);
      } else {
        // Start roty 1
        setRotation1Running(true);
        setActiveRotation(1);
        onRotationChange?.(1);
      }
    } else {
      if (rotation2Running) {
        // Stop roty 2
        setRotation2Running(false);
        setActiveRotation(rotation1Running ? 1 : null);
        onRotationChange?.(rotation1Running ? 1 : null);
      } else {
        // Start roty 2
        setRotation2Running(true);
        setActiveRotation(2);
        onRotationChange?.(2);
      }
    }
  };

  const handleReset = (rotation: 1 | 2) => {
    if (rotation === 1) {
      setRotation1Seconds(0);
    } else {
      setRotation2Seconds(0);
    }
  };

  const rotation1State = getWarningState(rotation1Seconds);
  const rotation2State = getWarningState(rotation2Seconds);

  const hasAnyCritical = rotation1State === 'critical' || rotation2State === 'critical';
  const hasAnyWarning = rotation1State === 'warning' || rotation2State === 'warning';

  return (
    <Card className={cn(
      'p-3 transition-all duration-300',
      hasAnyCritical && 'border-red-600 bg-red-50 animate-pulse',
      hasAnyWarning && !hasAnyCritical && 'border-orange-500 bg-orange-50'
    )}>
      <div className="flex items-center gap-3 flex-wrap">
        {/* Label */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">Rotacje:</span>
        </div>

        {/* Rota 1 */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleRotationClick(1)}
            className={cn(
              'h-9 px-4 font-bold transition-all',
              rotation1Running
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            )}
          >
            1 ROTA
          </Button>

          {rotation1Running && (
            <>
              <div className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded border',
                rotation1State === 'critical' ? 'bg-red-100 border-red-300' :
                rotation1State === 'warning' ? 'bg-orange-100 border-orange-300' :
                'bg-white border-gray-300'
              )}>
                <Clock className={cn(
                  'w-3.5 h-3.5',
                  rotation1State === 'critical' ? 'text-red-600' :
                  rotation1State === 'warning' ? 'text-orange-600' :
                  'text-gray-600'
                )} />
                <span className={cn(
                  'font-mono font-bold text-sm',
                  rotation1State === 'critical' ? 'text-red-600' :
                  rotation1State === 'warning' ? 'text-orange-600' :
                  'text-gray-900'
                )}>
                  {formatTime(rotation1Seconds)}
                </span>
              </div>

              <Button
                onClick={() => handleReset(1)}
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
        </div>

        {/* Rota 2 */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleRotationClick(2)}
            className={cn(
              'h-9 px-4 font-bold transition-all',
              rotation2Running
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            )}
          >
            2 ROTA
          </Button>

          {rotation2Running && (
            <>
              <div className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded border',
                rotation2State === 'critical' ? 'bg-red-100 border-red-300' :
                rotation2State === 'warning' ? 'bg-orange-100 border-orange-300' :
                'bg-white border-gray-300'
              )}>
                <Clock className={cn(
                  'w-3.5 h-3.5',
                  rotation2State === 'critical' ? 'text-red-600' :
                  rotation2State === 'warning' ? 'text-orange-600' :
                  'text-gray-600'
                )} />
                <span className={cn(
                  'font-mono font-bold text-sm',
                  rotation2State === 'critical' ? 'text-red-600' :
                  rotation2State === 'warning' ? 'text-orange-600' :
                  'text-gray-900'
                )}>
                  {formatTime(rotation2Seconds)}
                </span>
              </div>

              <Button
                onClick={() => handleReset(2)}
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
        </div>

        {/* Global warning badges */}
        {hasAnyCritical && (
          <Badge className="bg-red-600 animate-pulse">
            <AlertTriangle className="w-3 h-3 mr-1" />
            ZMIEŃ ROTĘ!
          </Badge>
        )}
        {hasAnyWarning && !hasAnyCritical && (
          <Badge className="bg-orange-500 animate-pulse">
            <AlertTriangle className="w-3 h-3 mr-1" />
            15+ min
          </Badge>
        )}
      </div>
    </Card>
  );
}

