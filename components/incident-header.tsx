'use client';

import { Incident } from '@/types/incident';
import { useIncidentStore } from '@/store/incident-store';
import {
  Clock,
  MapPin,
  User,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  Flag,
  Flame,
  Timer
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface IncidentHeaderProps {
  incident: Incident;
}

export default function IncidentHeader({ incident }: IncidentHeaderProps) {
  const { setIncidentStatus, markArrived, markControlled, completeIncident, getProgress } = useIncidentStore();
  
  const progress = getProgress();
  
  const getStatusBadge = () => {
    switch (incident.status) {
      case 'DISPATCHED':
        return <Badge className="bg-blue-500">📞 Zadysponowano</Badge>;
      case 'EN_ROUTE':
        return <Badge className="bg-indigo-500">🚒 W drodze</Badge>;
      case 'ON_SCENE':
        return <Badge className="bg-yellow-500">📍 Na miejscu</Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-orange-500 animate-pulse">🔥 W trakcie</Badge>;
      case 'CONTROLLED':
        return <Badge className="bg-green-500">✅ Opanowane</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary">🏁 Zakończone</Badge>;
      default:
        return <Badge variant="outline">❓ Nieznany</Badge>;
    }
  };

  const getPriorityBadge = () => {
    switch (incident.priority) {
      case 'CRITICAL':
        return <Badge variant="destructive" className="text-sm">🚨 Krytyczny</Badge>;
      case 'HIGH':
        return <Badge className="bg-orange-500 text-sm">⚠️ Wysoki</Badge>;
      case 'MEDIUM':
        return <Badge className="bg-yellow-500 text-sm">⚡ Średni</Badge>;
      default:
        return <Badge variant="secondary" className="text-sm">ℹ️ Niski</Badge>;
    }
  };
  
  const getElapsedTime = () => {
    const start = incident.arrivedAt || incident.dispatchedAt || incident.reportedAt;
    return formatDistanceToNow(start, { locale: pl });
  };

  return (
    <Card className="backdrop-blur-sm bg-white/95 border-white/20 shadow-xl mb-4 overflow-hidden animate-slide-up">
      {/* Gradient header bar */}
      <div className="h-2 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500" />

      <CardHeader className="pb-3 md:pb-4 px-3 md:px-6 pt-3 md:pt-6">
        <div className="flex items-start justify-between gap-2 md:gap-4">
          <div className="flex-1 space-y-1 md:space-y-3">
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <div className="relative hidden md:block">
                <Flame className="w-8 h-8 text-red-600 animate-pulse" />
                <div className="absolute inset-0 bg-red-600/20 blur-lg rounded-full" />
              </div>
              <CardTitle className="text-lg md:text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                {incident.title}
              </CardTitle>
              {getPriorityBadge()}
            </div>
            {incident.description && (
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed hidden md:block">{incident.description}</p>
            )}
          </div>

          <div className="flex flex-col items-end gap-1 md:gap-2">
            {getStatusBadge()}
            <Badge variant="outline" className="text-xs font-mono hidden md:inline-flex">
              ID: {incident.id.slice(-8)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 md:space-y-6 px-3 md:px-6 pb-3 md:pb-6">
        {/* Informacje podstawowe */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
          <Card key="info-location" className="bg-gradient-to-br from-red-50 to-transparent border-red-200">
            <CardContent className="p-2 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-red-100 rounded-lg">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium">Lokalizacja</p>
                  <p className="font-semibold text-gray-900 text-sm md:text-base truncate">{incident.location.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card key="info-commander" className="bg-gradient-to-br from-blue-50 to-transparent border-blue-200">
            <CardContent className="p-2 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium">Dowódca akcji</p>
                  <p className="font-semibold text-gray-900 text-sm md:text-base truncate">{incident.commander}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card key="info-duration" className="bg-gradient-to-br from-orange-50 to-transparent border-orange-200">
            <CardContent className="p-2 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-orange-100 rounded-lg">
                  <Timer className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium">Czas trwania</p>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">{getElapsedTime()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Postęp */}
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 md:gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" />
              <span className="text-xs md:text-sm font-semibold text-gray-700">Postęp</span>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {progress.completed}/{progress.total} • {progress.percentage}%
            </Badge>
          </div>
          <Progress value={progress.percentage} className="h-2 md:h-3" />
        </div>

        <Separator className="my-3 md:my-4" />

        {/* Przyciski akcji */}
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          {incident.status === 'DISPATCHED' && (
            <Button
              onClick={() => setIncidentStatus('EN_ROUTE')}
              className="bg-indigo-500 hover:bg-indigo-600 text-sm md:text-base h-9 md:h-10"
            >
              <PlayCircle className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
              🚒 Wyjazd
            </Button>
          )}

          {incident.status === 'EN_ROUTE' && (
            <Button
              onClick={markArrived}
              className="bg-yellow-500 hover:bg-yellow-600 text-sm md:text-base h-9 md:h-10"
            >
              <Flag className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
              📍 Przyjazd
            </Button>
          )}

          {(incident.status === 'ON_SCENE' || incident.status === 'IN_PROGRESS') && (
            <Button
              onClick={markControlled}
              className="bg-green-500 hover:bg-green-600 text-sm md:text-base h-9 md:h-10"
            >
              <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
              ✅ Opanowano
            </Button>
          )}

          {incident.status === 'CONTROLLED' && (
            <Button
              onClick={completeIncident}
              variant="secondary"
              className="text-sm md:text-base h-9 md:h-10"
            >
              <PauseCircle className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
              🏁 Zakończ
            </Button>
          )}

          {incident.status !== 'COMPLETED' && (
            <Button
              onClick={() => setIncidentStatus('IN_PROGRESS')}
              className="bg-orange-500 hover:bg-orange-600 text-sm md:text-base h-9 md:h-10"
            >
              <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
              🔥 W toku
            </Button>
          )}
        </div>

        <Separator />

        {/* Czasy kluczowe - Timeline */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Oś czasu akcji</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Card key="timeline-reported" className="bg-blue-50/50 border-blue-200">
              <CardContent className="p-3">
                <p className="text-xs text-gray-600 mb-1">📞 Zgłoszenie</p>
                <p className="font-bold text-sm font-mono">{format(incident.reportedAt, 'HH:mm:ss')}</p>
              </CardContent>
            </Card>

            {incident.dispatchedAt && (
              <Card key="timeline-dispatched" className="bg-indigo-50/50 border-indigo-200">
                <CardContent className="p-3">
                  <p className="text-xs text-gray-600 mb-1">🚒 Wyjazd</p>
                  <p className="font-bold text-sm font-mono">{format(incident.dispatchedAt, 'HH:mm:ss')}</p>
                </CardContent>
              </Card>
            )}

            {incident.arrivedAt && (
              <Card key="timeline-arrived" className="bg-yellow-50/50 border-yellow-200">
                <CardContent className="p-3">
                  <p className="text-xs text-gray-600 mb-1">📍 Przyjazd</p>
                  <p className="font-bold text-sm font-mono">{format(incident.arrivedAt, 'HH:mm:ss')}</p>
                </CardContent>
              </Card>
            )}

            {incident.controlledAt && (
              <Card key="timeline-controlled" className="bg-green-50/50 border-green-200">
                <CardContent className="p-3">
                  <p className="text-xs text-gray-600 mb-1">✅ Opanowano</p>
                  <p className="font-bold text-sm font-mono">{format(incident.controlledAt, 'HH:mm:ss')}</p>
                </CardContent>
              </Card>
            )}

            {incident.completedAt && (
              <Card key="timeline-completed" className="bg-gray-50/50 border-gray-200">
                <CardContent className="p-3">
                  <p className="text-xs text-gray-600 mb-1">🏁 Zakończono</p>
                  <p className="font-bold text-sm font-mono">{format(incident.completedAt, 'HH:mm:ss')}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

