'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, RotateCcw, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FirefighterEntry {
  id: string;
  name: string;
  entryTime: Date | null;
  exitTime: Date | null;
}

interface RotationData {
  rotation1: FirefighterEntry[];
  rotation2: FirefighterEntry[];
  ritRotation: FirefighterEntry[];
}

export default function RotationBoard() {
  const [rotationData, setRotationData] = useState<RotationData>({
    rotation1: Array(4).fill(null).map((_, i) => ({ id: `r1-${i}`, name: '', entryTime: null, exitTime: null })),
    rotation2: Array(4).fill(null).map((_, i) => ({ id: `r2-${i}`, name: '', entryTime: null, exitTime: null })),
    ritRotation: Array(4).fill(null).map((_, i) => ({ id: `rit-${i}`, name: '', entryTime: null, exitTime: null })),
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingCell, setEditingCell] = useState<{ rotation: keyof RotationData; index: number; field: 'name' | 'entryTime' | 'exitTime' } | null>(null);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  };

  const getElapsedMinutes = (entryTime: Date | null, exitTime: Date | null) => {
    if (!entryTime) return 0;
    const end = exitTime || currentTime;
    return Math.floor((end.getTime() - entryTime.getTime()) / 60000);
  };

  const getTimeColor = (minutes: number) => {
    if (minutes >= 15) return 'bg-red-500';
    if (minutes >= 10) return 'bg-orange-400';
    if (minutes >= 5) return 'bg-yellow-300';
    return 'bg-white';
  };

  const handleCellClick = (rotation: keyof RotationData, index: number, field: 'name' | 'entryTime' | 'exitTime') => {
    setEditingCell({ rotation, index, field });
  };

  const handleNameChange = (rotation: keyof RotationData, index: number, value: string) => {
    setRotationData(prev => ({
      ...prev,
      [rotation]: prev[rotation].map((entry, i) => 
        i === index ? { ...entry, name: value } : entry
      )
    }));
  };

  const handleTimeSet = (rotation: keyof RotationData, index: number, field: 'entryTime' | 'exitTime') => {
    setRotationData(prev => ({
      ...prev,
      [rotation]: prev[rotation].map((entry, i) => 
        i === index ? { ...entry, [field]: new Date() } : entry
      )
    }));
    setEditingCell(null);
  };

  const handleTimeClear = (rotation: keyof RotationData, index: number, field: 'entryTime' | 'exitTime') => {
    setRotationData(prev => ({
      ...prev,
      [rotation]: prev[rotation].map((entry, i) => 
        i === index ? { ...entry, [field]: null } : entry
      )
    }));
  };

  const renderRotationRow = (rotation: keyof RotationData, label: string, numberBgColor: string) => {
    const entries = rotationData[rotation];

    return (
      <div className="grid grid-cols-[100px_repeat(4,1fr)] gap-0 border-b-2 border-black">
        {/* Number Label */}
        <div className={cn("flex items-center justify-center font-black text-4xl border-r-2 border-black py-8", numberBgColor)}>
          {label}
        </div>

        {/* Firefighter entries */}
        {entries.map((entry, index) => {
          const elapsed = getElapsedMinutes(entry.entryTime, entry.exitTime);
          const timeColor = entry.entryTime && !entry.exitTime ? getTimeColor(elapsed) : 'bg-white';

          return (
            <div key={entry.id} className="grid grid-rows-[auto_auto_1fr_1fr] border-r-2 border-black last:border-r-0">
              {/* CZAS / WEJŚCIE label */}
              <div className="border-b border-black p-1 bg-gray-100 text-center">
                <span className="text-xs font-bold">CZAS</span>
              </div>

              {/* WEJŚCIE label */}
              <div className="border-b border-black p-1 bg-gray-100 text-center">
                <span className="text-xs font-bold">WEJŚCIE</span>
              </div>

              {/* Name + Entry Time */}
              <div
                className={cn(
                  "border-b border-black p-3 flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-all min-h-[80px]",
                  timeColor
                )}
                onClick={() => handleCellClick(rotation, index, 'name')}
              >
                {editingCell?.rotation === rotation && editingCell?.index === index && editingCell?.field === 'name' ? (
                  <Input
                    value={entry.name}
                    onChange={(e) => handleNameChange(rotation, index, e.target.value)}
                    onBlur={() => setEditingCell(null)}
                    autoFocus
                    className="h-8 text-center font-bold text-sm"
                    placeholder="Nazwisko"
                  />
                ) : (
                  <>
                    <span className="font-bold text-sm mb-2">{entry.name || '—'}</span>
                    <div
                      className="font-mono font-bold text-xl cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTimeSet(rotation, index, 'entryTime');
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleTimeClear(rotation, index, 'entryTime');
                      }}
                    >
                      {formatTime(entry.entryTime) || '—:—'}
                    </div>
                    {entry.entryTime && !entry.exitTime && (
                      <Badge variant="secondary" className="mt-1 text-xs font-bold">
                        {elapsed} min
                      </Badge>
                    )}
                  </>
                )}
              </div>

              {/* BAR label + Exit Time */}
              <div className="grid grid-rows-[auto_1fr]">
                <div className="border-b border-black p-1 bg-gray-100 text-center">
                  <span className="text-xs font-bold">BAR</span>
                </div>
                <div
                  className="p-3 flex items-center justify-center cursor-pointer hover:bg-gray-100 bg-white"
                  onClick={() => handleTimeSet(rotation, index, 'exitTime')}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleTimeClear(rotation, index, 'exitTime');
                  }}
                >
                  <span className="font-mono font-bold text-xl">
                    {formatTime(entry.exitTime) || '—:—'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Get max time for any active rotation
  const getMaxActiveTime = () => {
    let maxMinutes = 0;
    [...rotationData.rotation1, ...rotationData.rotation2, ...rotationData.ritRotation].forEach(entry => {
      if (entry.entryTime && !entry.exitTime) {
        const minutes = getElapsedMinutes(entry.entryTime, null);
        if (minutes > maxMinutes) maxMinutes = minutes;
      }
    });
    return maxMinutes;
  };

  const maxActiveTime = getMaxActiveTime();
  const showCriticalAlert = maxActiveTime >= 15;
  const showWarningAlert = maxActiveTime >= 5 && maxActiveTime < 15;

  return (
    <div className="space-y-4">
      {/* Header with current time and alerts */}
      <Card className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold">Tablica Rot w Aparatach</h2>
              <p className="text-sm text-gray-600">Kliknij komórkę aby ustawić czas, PPM aby wyczyścić</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Current time */}
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-mono text-2xl font-bold">
                {currentTime.toLocaleTimeString('pl-PL')}
              </span>
            </div>

            {/* Alert badges */}
            {showCriticalAlert && (
              <Badge className="bg-red-600 animate-pulse text-base px-3 py-1">
                <AlertTriangle className="w-4 h-4 mr-1" />
                {maxActiveTime} MIN - ZMIEŃ ROTĘ!
              </Badge>
            )}
            {showWarningAlert && (
              <Badge className="bg-orange-500 text-base px-3 py-1">
                <AlertTriangle className="w-4 h-4 mr-1" />
                {maxActiveTime} min w aparatach
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Rotation Board */}
      <Card className="overflow-hidden border-4 border-black">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Top header - unit name */}
            <div className="bg-yellow-400 border-b-2 border-black p-3 text-center">
              <h3 className="font-black text-lg uppercase">Tablica Rot w Aparatach - Jednostka OSP</h3>
            </div>

            {/* Header row - yellow */}
            <div className="grid grid-cols-[100px_repeat(4,1fr)] gap-0 bg-yellow-400 border-b-2 border-black">
              <div className="border-r-2 border-black p-4 flex items-center justify-center">
                <span className="font-black text-sm">ROTA</span>
              </div>
              <div className="border-r-2 border-black p-4 flex items-center justify-center font-black text-2xl">1</div>
              <div className="border-r-2 border-black p-4 flex items-center justify-center font-black text-2xl">2</div>
              <div className="border-r-2 border-black p-4 flex items-center justify-center font-black text-2xl">3</div>
              <div className="p-4 flex items-center justify-center font-black text-2xl">4</div>
            </div>

            {/* Rotation 1 - yellow number */}
            {renderRotationRow('rotation1', '1', 'bg-yellow-300')}

            {/* Rotation 2 - blue number */}
            {renderRotationRow('rotation2', '2', 'bg-blue-300')}

            {/* RIT Rotation - red number */}
            {renderRotationRow('ritRotation', 'R', 'bg-red-400')}
          </div>
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Legenda kolorów:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded"></div>
            <span className="text-sm">&lt; 5 min</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-300 border-2 border-gray-300 rounded"></div>
            <span className="text-sm">5-9 min</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-400 border-2 border-gray-300 rounded"></div>
            <span className="text-sm">10-14 min</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 border-2 border-gray-300 rounded"></div>
            <span className="text-sm">≥ 15 min</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

