'use client';

import { useState, useEffect } from 'react';
import { Incident } from '@/types/incident';
import { useIncidentStore } from '@/store/incident-store';
import {
  Clock,
  MapPin,
  User,
  Flame,
  Check,
  X,
} from 'lucide-react';
import { differenceInSeconds } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface IncidentHeaderV2Props {
  incident: Incident;
}

export default function IncidentHeaderV2({ incident }: IncidentHeaderV2Props) {
  const { setIncidentStatus, markArrived, markControlled, completeIncident, getProgress, updateIncident } = useIncidentStore();
  
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [editingLocation, setEditingLocation] = useState(false);
  const [editingCommander, setEditingCommander] = useState(false);
  const [locationValue, setLocationValue] = useState(incident.location.address);
  const [commanderValue, setCommanderValue] = useState(incident.commander);
  
  const progress = getProgress();

  // Live timer
  useEffect(() => {
    const start = incident.arrivedAt || incident.dispatchedAt || incident.reportedAt;
    
    const updateTimer = () => {
      setElapsedSeconds(differenceInSeconds(new Date(), start));
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [incident]);

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (incident.status) {
      case 'DISPATCHED': return 'bg-blue-500';
      case 'EN_ROUTE': return 'bg-indigo-500';
      case 'ON_SCENE': return 'bg-yellow-500';
      case 'IN_PROGRESS': return 'bg-orange-500';
      case 'CONTROLLED': return 'bg-green-500';
      case 'COMPLETED': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = () => {
    switch (incident.status) {
      case 'DISPATCHED': return 'Zadysponowano';
      case 'EN_ROUTE': return 'W drodze';
      case 'ON_SCENE': return 'Na miejscu';
      case 'IN_PROGRESS': return 'W trakcie';
      case 'CONTROLLED': return 'Opanowane';
      case 'COMPLETED': return 'Zakończone';
      default: return 'Nieznany';
    }
  };

  const getPriorityColor = () => {
    switch (incident.priority) {
      case 'CRITICAL': return 'bg-red-600 animate-pulse';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const handleSaveLocation = () => {
    updateIncident({ location: { ...incident.location, address: locationValue } });
    setEditingLocation(false);
  };

  const handleSaveCommander = () => {
    updateIncident({ commander: commanderValue });
    setEditingCommander(false);
  };

  const getNextAction = () => {
    switch (incident.status) {
      case 'DISPATCHED':
        return { label: '🚒 Wyjazd', action: () => setIncidentStatus('EN_ROUTE'), color: 'bg-indigo-600 hover:bg-indigo-700' };
      case 'EN_ROUTE':
        return { label: '📍 Przyjazd', action: markArrived, color: 'bg-yellow-600 hover:bg-yellow-700' };
      case 'ON_SCENE':
      case 'IN_PROGRESS':
        return { label: '✅ Opanowano', action: markControlled, color: 'bg-green-600 hover:bg-green-700' };
      case 'CONTROLLED':
        return { label: '🏁 Zakończ', action: completeIncident, color: 'bg-gray-600 hover:bg-gray-700' };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  // Critical alert - ponad 30 minut
  const isCriticalTime = elapsedSeconds > 1800; // 30 min

  return (
    <div className="sticky top-0 z-40 bg-white border-b-2 border-red-600 shadow-lg">
      {/* Status bar - cienki */}
      <div className={cn('h-1', getStatusColor())} />

      {/* MOBILE: 2 linie kompaktowe */}
      <div className="md:hidden px-2 py-2 space-y-2">
        {/* Linia 1: Timer + Status + Priority + Title */}
        <div className="flex items-center gap-2">
          {/* Timer */}
          <div className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded',
            isCriticalTime ? 'bg-red-100 animate-pulse' : 'bg-gray-100'
          )}>
            <Clock className={cn('w-5 h-5', isCriticalTime ? 'text-red-600' : 'text-gray-600')} />
            <span className={cn(
              'font-mono font-bold text-lg',
              isCriticalTime ? 'text-red-600' : 'text-gray-900'
            )}>
              {formatElapsedTime(elapsedSeconds)}
            </span>
          </div>

          {/* Priority emoji only */}
          <div className="text-2xl">
            {incident.priority === 'CRITICAL' && '🚨'}
            {incident.priority === 'HIGH' && '⚠️'}
            {incident.priority === 'MEDIUM' && '⚡'}
            {incident.priority === 'LOW' && 'ℹ️'}
          </div>

          {/* Title */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <Flame className="w-5 h-5 text-red-600 flex-shrink-0" />
            <h1 className="text-sm font-bold text-gray-900 truncate">{incident.title}</h1>
          </div>

          {/* Next Action */}
          {nextAction && (
            <Button
              onClick={nextAction.action}
              className={cn('h-10 text-sm font-bold px-3 flex-shrink-0', nextAction.color)}
            >
              {nextAction.label}
            </Button>
          )}
        </div>

        {/* Linia 2: Progress + Location */}
        <div className="flex items-center gap-2">
          {/* Progress */}
          <div className="flex items-center gap-2 flex-1">
            <Badge variant="outline" className="font-mono text-xs">
              {progress.percentage}%
            </Badge>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          {/* Location - tylko ikona + skrót */}
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-xs font-medium text-gray-700 truncate max-w-[100px]">
              {incident.location.address.split(',')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* DESKTOP: 1 linia jak było */}
      <div className="hidden md:block px-4 py-2">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Timer - kompaktowy */}
          <div className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded',
            isCriticalTime ? 'bg-red-100 animate-pulse' : 'bg-gray-100'
          )}>
            <Clock className={cn('w-4 h-4', isCriticalTime ? 'text-red-600' : 'text-gray-600')} />
            <span className={cn(
              'font-mono font-bold text-lg',
              isCriticalTime ? 'text-red-600' : 'text-gray-900'
            )}>
              {formatElapsedTime(elapsedSeconds)}
            </span>
          </div>

          {/* Status */}
          <Badge className={cn('text-xs px-2 py-1', getStatusColor())}>
            {getStatusLabel()}
          </Badge>

          {/* Priority */}
          <Badge className={cn('text-xs px-2 py-1', getPriorityColor())}>
            {incident.priority === 'CRITICAL' && '🚨'}
            {incident.priority === 'HIGH' && '⚠️'}
            {incident.priority === 'MEDIUM' && '⚡'}
            {incident.priority === 'LOW' && 'ℹ️'}
          </Badge>

          {/* Title - truncate */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <Flame className="w-4 h-4 text-red-600 flex-shrink-0" />
            <h1 className="text-base font-bold text-gray-900 truncate">{incident.title}</h1>
          </div>

          {/* Progress - kompaktowy */}
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="font-mono text-xs">
              {progress.percentage}%
            </Badge>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          {/* Location - inline editable */}
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
            {editingLocation ? (
              <div className="flex items-center gap-1">
                <Input
                  value={locationValue}
                  onChange={(e) => setLocationValue(e.target.value)}
                  className="h-7 text-xs w-32"
                  autoFocus
                />
                <Button size="sm" onClick={handleSaveLocation} className="h-7 px-1.5 bg-green-600">
                  <Check className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingLocation(false)} className="h-7 px-1.5">
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setEditingLocation(true)}
                className="text-xs font-medium text-gray-700 hover:text-gray-900 truncate max-w-[120px]"
              >
                {incident.location.address}
              </button>
            )}
          </div>

          {/* Commander - inline editable */}
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-blue-600 flex-shrink-0" />
            {editingCommander ? (
              <div className="flex items-center gap-1">
                <Input
                  value={commanderValue}
                  onChange={(e) => setCommanderValue(e.target.value)}
                  className="h-7 text-xs w-32"
                  autoFocus
                />
                <Button size="sm" onClick={handleSaveCommander} className="h-7 px-1.5 bg-green-600">
                  <Check className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingCommander(false)} className="h-7 px-1.5">
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setEditingCommander(true)}
                className="text-xs font-medium text-gray-700 hover:text-gray-900 truncate max-w-[100px]"
              >
                {incident.commander}
              </button>
            )}
          </div>

          {/* Next Action - kompaktowy */}
          {nextAction && (
            <Button
              onClick={nextAction.action}
              className={cn('h-8 text-xs font-bold px-3 ml-auto', nextAction.color)}
            >
              {nextAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

