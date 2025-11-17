'use client';

import { useIncidentStore } from '@/store/incident-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Flame, MapPin, Clock, User, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format, differenceInMinutes } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function ArchivePage() {
  const router = useRouter();
  const { archivedIncidents, deleteArchivedIncident } = useIncidentStore();

  const getIncidentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      FIRE: '🔥 Pożar',
      RESCUE: '🚑 Ratownictwo',
      HAZMAT: '☢️ Chemiczne',
      FLOOD: '🌊 Powódź',
      TRAFFIC: '🚗 Wypadek',
      OTHER: '📋 Inne',
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-600';
      case 'CONTROLLED': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Zakończone';
      case 'CONTROLLED': return 'Opanowane';
      default: return status;
    }
  };

  const getDuration = (incident: any) => {
    const start = incident.arrivedAt || incident.dispatchedAt || incident.reportedAt;
    const end = incident.completedAt || new Date();
    return differenceInMinutes(end, start);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Czy na pewno chcesz usunąć zdarzenie "${title}"?`)) {
      deleteArchivedIncident(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Powrót
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Archiwum zdarzeń</h1>
        </div>
        <p className="text-gray-600">
          Wszystkie zakończone zdarzenia ({archivedIncidents.length})
        </p>
      </div>

      {/* Lista zdarzeń */}
      <div className="max-w-6xl mx-auto space-y-4">
        {archivedIncidents.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 text-lg">Brak zdarzeń w archiwum</p>
              <p className="text-gray-400 text-sm mt-2">
                Zakończone zdarzenia będą tutaj zapisywane
              </p>
            </CardContent>
          </Card>
        ) : (
          archivedIncidents
            .sort((a, b) => new Date(b.completedAt || b.reportedAt).getTime() - new Date(a.completedAt || a.reportedAt).getTime())
            .map((incident) => (
              <Card key={incident.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(incident.status)}>
                          {getStatusLabel(incident.status)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {getIncidentTypeLabel(incident.type)}
                        </span>
                      </div>
                      <CardTitle className="text-xl mb-2">{incident.title}</CardTitle>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>
                            {format(new Date(incident.completedAt || incident.reportedAt), 'dd MMM yyyy, HH:mm', { locale: pl })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{incident.location.address}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4" />
                          <span>{incident.commander}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Czas trwania: {getDuration(incident)} min
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        onClick={() => router.push(`/archive/${incident.id}`)}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Podgląd
                      </Button>
                      <Button
                        onClick={() => handleDelete(incident.id, incident.title)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
        )}
      </div>
    </div>
  );
}

