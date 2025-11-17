'use client';

import { useIncidentStore } from '@/store/incident-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Clock, MapPin, User, CheckCircle2, XCircle, Circle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { format, differenceInMinutes } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function ArchivedIncidentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { getArchivedIncidentById } = useIncidentStore();
  const incident = getArchivedIncidentById(id);

  if (!incident) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-6xl mx-auto">
          <Button onClick={() => router.push('/archive')} variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do archiwum
          </Button>
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 text-lg">Zdarzenie nie znalezione</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getDuration = () => {
    const start = incident.arrivedAt || incident.dispatchedAt || incident.reportedAt;
    const end = incident.completedAt || new Date();
    return differenceInMinutes(end, start);
  };

  const getProgress = () => {
    let completed = 0;
    let total = 0;
    
    incident.checklists.forEach(category => {
      category.items.forEach(item => {
        total++;
        if (item.status === 'COMPLETED') completed++;
      });
    });
    
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const progress = getProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button onClick={() => router.push('/archive')} variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do archiwum
          </Button>
          
          <Card className="border-2 border-gray-300">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-600">Zakończone</Badge>
                    <Badge variant="outline">{progress.percentage}% ukończone</Badge>
                  </div>
                  <CardTitle className="text-2xl mb-3">{incident.title}</CardTitle>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <div>
                        <div className="font-medium">
                          {format(new Date(incident.reportedAt), 'dd MMM yyyy, HH:mm', { locale: pl })}
                        </div>
                        <div className="text-xs text-gray-500">Czas trwania: {getDuration()} min</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{incident.location.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{incident.commander}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="checklist" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="checklist">Checklist ({progress.completed}/{progress.total})</TabsTrigger>
            <TabsTrigger value="casualties">Poszkodowani ({incident.casualties?.length || 0})</TabsTrigger>
            <TabsTrigger value="notes">Notatki ({incident.notes?.length || 0})</TabsTrigger>
            <TabsTrigger value="photos">Zdjęcia ({incident.photos?.length || 0})</TabsTrigger>
          </TabsList>

          {/* Checklist Tab */}
          <TabsContent value="checklist" className="space-y-4">
            {incident.checklists.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                        {item.status === 'COMPLETED' && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
                        {item.status === 'SKIPPED' && <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />}
                        {item.status === 'PENDING' && <Circle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />}
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.title}</div>
                          {item.notes && (
                            <div className="text-sm text-gray-600 mt-1">📝 {item.notes}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Casualties Tab */}
          <TabsContent value="casualties" className="space-y-4">
            {incident.casualties && incident.casualties.length > 0 ? (
              incident.casualties.map((casualty: any) => (
                <Card key={casualty.id}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {casualty.name || 'Poszkodowany'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Podstawowe informacje */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      {casualty.age && (
                        <div>
                          <div className="text-gray-500 text-xs">Wiek</div>
                          <div className="font-medium">{casualty.age}</div>
                        </div>
                      )}
                      {casualty.ageGroup && (
                        <div>
                          <div className="text-gray-500 text-xs">Grupa wiekowa</div>
                          <div className="font-medium">
                            {casualty.ageGroup === 'ADULT' && 'Dorosły'}
                            {casualty.ageGroup === 'CHILD' && 'Dziecko'}
                            {casualty.ageGroup === 'INFANT' && 'Niemowlę'}
                          </div>
                        </div>
                      )}
                      {casualty.consciousness && (
                        <div>
                          <div className="text-gray-500 text-xs">Świadomość (ACVPU)</div>
                          <div className="font-medium">
                            <Badge variant={casualty.consciousness === 'A' ? 'default' : 'destructive'}>
                              {casualty.consciousness}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Parametry życiowe */}
                    {casualty.vitalSigns && casualty.vitalSigns.length > 0 && (
                      <div>
                        <div className="text-sm font-semibold mb-2">Parametry życiowe</div>
                        <div className="space-y-2">
                          {casualty.vitalSigns.map((vs: any, idx: number) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded-lg text-sm">
                              <div className="text-xs text-gray-500 mb-2">
                                {format(new Date(vs.measuredAt), 'dd MMM yyyy, HH:mm', { locale: pl })}
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {vs.respiratoryRate !== null && (
                                  <div>
                                    <span className="text-gray-600">Oddech:</span> {vs.respiratoryRate}/min
                                  </div>
                                )}
                                {vs.pulseRate !== null && (
                                  <div>
                                    <span className="text-gray-600">Tętno:</span> {vs.pulseRate}/min
                                  </div>
                                )}
                                {vs.oxygenSaturation !== null && (
                                  <div>
                                    <span className="text-gray-600">SpO₂:</span> {vs.oxygenSaturation}%
                                  </div>
                                )}
                                {vs.temperature !== null && (
                                  <div>
                                    <span className="text-gray-600">Temp:</span> {vs.temperature}°C
                                  </div>
                                )}
                                {vs.bloodPressureSystolic !== null && vs.bloodPressureDiastolic !== null && (
                                  <div>
                                    <span className="text-gray-600">BP:</span> {vs.bloodPressureSystolic}/{vs.bloodPressureDiastolic}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Obrażenia */}
                    {casualty.injuries && (
                      <div>
                        <div className="text-sm font-semibold mb-1">Obrażenia</div>
                        <div className="text-sm text-gray-700 bg-red-50 p-3 rounded-lg">
                          {casualty.injuries}
                        </div>
                      </div>
                    )}

                    {/* Podjęte działania */}
                    {casualty.actionsTaken && (
                      <div>
                        <div className="text-sm font-semibold mb-1">Podjęte działania</div>
                        <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                          {casualty.actionsTaken}
                        </div>
                      </div>
                    )}

                    {/* Wywiad SAMPLE */}
                    {casualty.sampleNotes && (
                      <div>
                        <div className="text-sm font-semibold mb-1">Wywiad SAMPLE</div>
                        <div className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg">
                          {casualty.sampleNotes}
                        </div>
                      </div>
                    )}

                    {/* Dodatkowe notatki */}
                    {casualty.additionalNotes && (
                      <div>
                        <div className="text-sm font-semibold mb-1">Dodatkowe notatki</div>
                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {casualty.additionalNotes}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-6 text-center text-gray-500">
                  Brak poszkodowanych
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4">
            {incident.notes && incident.notes.length > 0 ? (
              incident.notes.map((note: any) => (
                <Card key={note.id} className={note.important ? 'border-2 border-yellow-400' : ''}>
                  <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-2">
                          {format(new Date(note.timestamp), 'dd MMM yyyy, HH:mm:ss', { locale: pl })}
                        </div>
                        <div className="text-gray-900 whitespace-pre-wrap">{note.content}</div>
                      </div>
                      {note.important && (
                        <Badge variant="default" className="bg-yellow-500">Ważne</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-6 text-center text-gray-500">
                  Brak notatek
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-4">
            {incident.photos && incident.photos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {incident.photos.map((photo: any) => (
                  <Card key={photo.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-video bg-gray-100">
                        <img
                          src={photo.url}
                          alt={photo.description || 'Zdjęcie ze zdarzenia'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        {photo.description && (
                          <p className="text-sm text-gray-700 mb-2">{photo.description}</p>
                        )}
                        <p className="text-xs text-gray-400">
                          📅 {format(new Date(photo.timestamp), 'dd MMM yyyy, HH:mm:ss', { locale: pl })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-6 text-center text-gray-500">
                  Brak zdjęć
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

