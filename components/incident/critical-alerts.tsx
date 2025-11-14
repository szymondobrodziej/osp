'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Clock, Users, Flame, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface CriticalAlert {
  id: string;
  type: 'TIME' | 'CASUALTIES' | 'RESOURCES' | 'HAZARD' | 'CUSTOM';
  severity: 'WARNING' | 'CRITICAL';
  title: string;
  message: string;
  timestamp: Date;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface CriticalAlertsProps {
  alerts: CriticalAlert[];
  onDismiss?: (alertId: string) => void;
}

export default function CriticalAlerts({ alerts, onDismiss }: CriticalAlertsProps) {
  const [visibleAlerts, setVisibleAlerts] = useState<CriticalAlert[]>(alerts);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setVisibleAlerts(alerts);
    
    // Play alert sound for new critical alerts
    if (soundEnabled && alerts.some(a => a.severity === 'CRITICAL')) {
      // TODO: Play alert sound
      // const audio = new Audio('/alert-sound.mp3');
      // audio.play().catch(() => {});
    }
  }, [alerts, soundEnabled]);

  const handleDismiss = (alertId: string) => {
    setVisibleAlerts(prev => prev.filter(a => a.id !== alertId));
    onDismiss?.(alertId);
  };

  const getAlertIcon = (type: CriticalAlert['type']) => {
    switch (type) {
      case 'TIME':
        return Clock;
      case 'CASUALTIES':
        return Users;
      case 'RESOURCES':
        return AlertTriangle;
      case 'HAZARD':
        return Flame;
      default:
        return AlertTriangle;
    }
  };

  const getAlertColor = (severity: CriticalAlert['severity']) => {
    return severity === 'CRITICAL'
      ? 'border-red-600 bg-red-50'
      : 'border-orange-500 bg-orange-50';
  };

  const getAlertBadgeColor = (severity: CriticalAlert['severity']) => {
    return severity === 'CRITICAL'
      ? 'bg-red-600'
      : 'bg-orange-500';
  };

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 left-4 md:left-auto md:w-96 z-50 space-y-2 animate-slide-down">
      {visibleAlerts.map((alert) => {
        const Icon = getAlertIcon(alert.type);
        
        return (
          <Card
            key={alert.id}
            className={cn(
              'border-2 shadow-2xl animate-shake',
              getAlertColor(alert.severity),
              alert.severity === 'CRITICAL' && 'animate-pulse'
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={cn(
                  'p-2 rounded-lg flex-shrink-0',
                  alert.severity === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-500'
                )}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">{alert.title}</h4>
                      <Badge className={cn('text-xs', getAlertBadgeColor(alert.severity))}>
                        {alert.severity === 'CRITICAL' ? '🚨 KRYTYCZNE' : '⚠️ OSTRZEŻENIE'}
                      </Badge>
                    </div>
                    
                    {alert.dismissible && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismiss(alert.id)}
                        className="h-6 w-6 p-0 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <p className="text-sm text-gray-700 mb-2">{alert.message}</p>

                  {alert.action && (
                    <Button
                      onClick={alert.action.onClick}
                      size="sm"
                      className={cn(
                        'h-8 text-xs',
                        alert.severity === 'CRITICAL'
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-orange-500 hover:bg-orange-600'
                      )}
                    >
                      {alert.action.label}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Hook do generowania alertów
export function useIncidentAlerts(incident: any) {
  const [alerts, setAlerts] = useState<CriticalAlert[]>([]);

  useEffect(() => {
    const newAlerts: CriticalAlert[] = [];

    // Alert: Długi czas trwania (>30 min)
    const start = incident.arrivedAt || incident.dispatchedAt || incident.reportedAt;
    const elapsedMinutes = Math.floor((Date.now() - start.getTime()) / 60000);
    
    if (elapsedMinutes > 30) {
      newAlerts.push({
        id: 'time-critical',
        type: 'TIME',
        severity: elapsedMinutes > 60 ? 'CRITICAL' : 'WARNING',
        title: 'Długi czas akcji',
        message: `Akcja trwa już ${elapsedMinutes} minut. Rozważ rotację załogi.`,
        timestamp: new Date(),
        dismissible: true,
      });
    }

    // Alert: Brak postępu w checkliście
    const progress = incident.checklists?.reduce((acc: any, cat: any) => {
      const completed = cat.items.filter((i: any) => i.status === 'COMPLETED').length;
      const total = cat.items.length;
      return { completed: acc.completed + completed, total: acc.total + total };
    }, { completed: 0, total: 0 });

    if (progress && progress.total > 0 && progress.completed === 0 && elapsedMinutes > 5) {
      newAlerts.push({
        id: 'checklist-no-progress',
        type: 'RESOURCES',
        severity: 'WARNING',
        title: 'Brak postępu w checkliście',
        message: 'Nie zaznaczono żadnego zadania. Rozpocznij wykonywanie procedur.',
        timestamp: new Date(),
        dismissible: true,
        action: {
          label: 'Przejdź do checklisty',
          onClick: () => {
            // Scroll to checklist
            document.getElementById('checklist-tab')?.click();
          },
        },
      });
    }

    // Alert: Krytyczny priorytet
    if (incident.priority === 'CRITICAL' && incident.status !== 'CONTROLLED') {
      newAlerts.push({
        id: 'priority-critical',
        type: 'HAZARD',
        severity: 'CRITICAL',
        title: 'Zdarzenie krytyczne',
        message: 'To zdarzenie ma najwyższy priorytet. Zachowaj szczególną ostrożność.',
        timestamp: new Date(),
        dismissible: false,
      });
    }

    setAlerts(newAlerts);
  }, [incident]);

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  return { alerts, dismissAlert };
}

