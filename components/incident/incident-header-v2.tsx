'use client';

import { useState, useEffect } from 'react';
import { Incident } from '@/types/incident';
import { useIncidentStore } from '@/store/incident-store';
import {
  Clock,
  MapPin,
  User,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  Flag,
  Flame,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { formatDistanceToNow, format, differenceInSeconds } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
    <div className="sticky top-0 z-40 bg-white border-b-4 border-red-600 shadow-xl">
      {/* Status bar - pełna szerokość */}
      <div className={cn('h-2', getStatusColor())} />

      <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4">
        {/* Top row - Timer + Status + Priority */}
        <div className="flex items-center justify-between mb-3 md:mb-4">
          {/* Live Timer - DUŻY */}
          <div className={cn(
            'flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg',
            isCriticalTime ? 'bg-red-100 border-2 border-red-600 animate-pulse' : 'bg-gray-100'
          )}>
            <Clock className={cn('w-5 h-5 md:w-6 md:h-6', isCriticalTime ? 'text-red-600' : 'text-gray-700')} />
            <span className={cn(
              'font-mono font-bold text-xl md:text-3xl',
              isCriticalTime ? 'text-red-600' : 'text-gray-900'
            )}>
              {formatElapsedTime(elapsedSeconds)}
            </span>
          </div>

          {/* Status + Priority */}
          <div className="flex items-center gap-2">
            <Badge className={cn('text-sm md:text-base px-3 md:px-4 py-1.5 md:py-2', getStatusColor())}>
              {getStatusLabel()}
            </Badge>
            <Badge className={cn('text-sm md:text-base px-3 md:px-4 py-1.5 md:py-2', getPriorityColor())}>
              {incident.priority === 'CRITICAL' && '🚨'}
              {incident.priority === 'HIGH' && '⚠️'}
              {incident.priority === 'MEDIUM' && '⚡'}
              {incident.priority === 'LOW' && 'ℹ️'}
            </Badge>
          </div>
        </div>

        {/* Title + Progress */}
        <div className="mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <Flame className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">{incident.title}</h1>
          </div>
          
          {/* Progress bar - DUŻY */}
          <div className="space-y-1.5 md:space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm md:text-base font-semibold text-gray-700">Postęp checklisty</span>
              <Badge variant="outline" className="font-mono text-sm md:text-base">
                {progress.completed}/{progress.total} • {progress.percentage}%
              </Badge>
            </div>
            <Progress value={progress.percentage} className="h-3 md:h-4" />
          </div>
        </div>

        {/* Info cards - editable inline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4">
          {/* Location - editable */}
          <Card className="border-2 border-red-200">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-500 font-medium mb-1">Lokalizacja</p>
                  {editingLocation ? (
                    <div className="flex items-center gap-1">
                      <Input
                        value={locationValue}
                        onChange={(e) => setLocationValue(e.target.value)}
                        className="h-8 text-sm"
                        autoFocus
                      />
                      <Button size="sm" onClick={handleSaveLocation} className="h-8 px-2 bg-green-600">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingLocation(false)} className="h-8 px-2">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm md:text-lg text-gray-900 truncate">{incident.location.address}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingLocation(true)}
                        className="h-6 w-6 p-0 flex-shrink-0"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commander - editable */}
          <Card className="border-2 border-blue-200">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-500 font-medium mb-1">Dowódca akcji</p>
                  {editingCommander ? (
                    <div className="flex items-center gap-1">
                      <Input
                        value={commanderValue}
                        onChange={(e) => setCommanderValue(e.target.value)}
                        className="h-8 text-sm"
                        autoFocus
                      />
                      <Button size="sm" onClick={handleSaveCommander} className="h-8 px-2 bg-green-600">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingCommander(false)} className="h-8 px-2">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm md:text-lg text-gray-900 truncate">{incident.commander}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingCommander(true)}
                        className="h-6 w-6 p-0 flex-shrink-0"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Action Button - DUŻY */}
        {nextAction && (
          <Button
            onClick={nextAction.action}
            className={cn('w-full h-14 md:h-16 text-lg md:text-xl font-bold', nextAction.color)}
          >
            {nextAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}

