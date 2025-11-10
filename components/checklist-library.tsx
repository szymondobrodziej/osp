'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Download,
  Upload,
  Search,
  Flame,
  FolderOpen,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { ChecklistTemplate, IncidentType } from '@/types/incident';
import { useChecklistStore } from '@/store/checklist-store';
import { ChecklistBuilder } from './checklist-builder';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

const INCIDENT_TYPE_LABELS: Record<IncidentType | 'CUSTOM', string> = {
  CUSTOM: 'Własny',
  FIRE_BUILDING: 'Pożar budynku',
  FIRE_FOREST: 'Pożar lasu',
  FIRE_VEHICLE: 'Pożar pojazdu',
  FIRE_OUTDOOR: 'Pożar otwarty',
  ACCIDENT_ROAD: 'Wypadek drogowy',
  ACCIDENT_INDUSTRIAL: 'Wypadek przemysłowy',
  HAZMAT_CHEMICAL: 'Zagrożenie chemiczne',
  HAZMAT_ECOLOGICAL: 'Zagrożenie ekologiczne',
  RESCUE_WATER: 'Ratownictwo wodne',
  RESCUE_HEIGHT: 'Ratownictwo wysokościowe',
  RESCUE_TECHNICAL: 'Ratownictwo techniczne',
  FLOOD: 'Powódź',
  STORM: 'Burza/Wichura',
  OTHER: 'Inne',
};

export function ChecklistLibrary() {
  // Pobierz customTemplates reaktywnie z store
  const customTemplates = useChecklistStore(state => state.customTemplates);
  const deleteTemplate = useChecklistStore(state => state.deleteTemplate);
  const duplicateTemplate = useChecklistStore(state => state.duplicateTemplate);
  const exportTemplate = useChecklistStore(state => state.exportTemplate);
  const importTemplate = useChecklistStore(state => state.importTemplate);
  const getAllTemplates = useChecklistStore(state => state.getAllTemplates);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'builtin' | 'custom'>('all');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importJson, setImportJson] = useState('');

  // Wywołaj getAllTemplates() - będzie reaktywne bo customTemplates jest reaktywne
  const allTemplates = getAllTemplates();

  // Filtrowanie
  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = selectedTab === 'all' ||
                      (selectedTab === 'builtin' && template.isBuiltIn) ||
                      (selectedTab === 'custom' && !template.isBuiltIn);
    
    return matchesSearch && matchesTab;
  });

  const handleDuplicate = (template: ChecklistTemplate) => {
    const newName = prompt(`Podaj nazwę dla kopii szablonu "${template.name}":`, `${template.name} (kopia)`);
    if (newName) {
      duplicateTemplate(template.id, newName);
    }
  };

  const handleExport = (template: ChecklistTemplate) => {
    const json = exportTemplate(template.id);
    if (json) {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `checklist-${template.name.replace(/\s+/g, '-').toLowerCase()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = () => {
    try {
      const template = importTemplate(importJson);
      if (template) {
        setImportDialogOpen(false);
        setImportJson('');
        alert(`Szablon "${template.name}" został zaimportowany!`);
      } else {
        alert('Błąd importu. Sprawdź format JSON.');
      }
    } catch (error) {
      alert('Błąd importu. Sprawdź format JSON.');
    }
  };

  const handleDelete = (template: ChecklistTemplate) => {
    if (template.isBuiltIn) {
      alert('Nie można usunąć wbudowanego szablonu.');
      return;
    }
    
    if (confirm(`Czy na pewno chcesz usunąć szablon "${template.name}"?`)) {
      deleteTemplate(template.id);
    }
  };

  // Jeśli edytujemy lub tworzymy
  if (editingTemplateId || isCreating) {
    return (
      <ChecklistBuilder
        templateId={editingTemplateId || undefined}
        onSave={() => {
          setEditingTemplateId(null);
          setIsCreating(false);
        }}
        onCancel={() => {
          setEditingTemplateId(null);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-3 md:space-y-6">
      {/* Header */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-red-600 to-orange-600">
        <CardHeader className="p-3 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <FolderOpen className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl md:text-3xl text-white">Biblioteka Checklistów</CardTitle>
                <CardDescription className="text-white/80 text-xs md:text-sm">
                  Zarządzaj szablonami checklistów dla różnych typów zdarzeń
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-1.5 md:gap-2 w-full md:w-auto">
              <Button
                onClick={() => setImportDialogOpen(true)}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 flex-1 md:flex-none h-8 md:h-10 text-xs md:text-sm px-2 md:px-4"
              >
                <Upload className="w-3.5 h-3.5 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden sm:inline">Import</span>
              </Button>
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-white text-red-600 hover:bg-white/90 flex-1 md:flex-none h-8 md:h-10 text-xs md:text-sm px-2 md:px-4"
              >
                <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden sm:inline">Nowy szablon</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj szablonów..."
                className="pl-9 md:pl-10 text-sm h-9 md:h-10"
              />
            </div>
            <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)} className="w-full md:w-auto">
              <TabsList className="grid grid-cols-3 w-full md:w-auto">
                <TabsTrigger value="all" className="text-xs md:text-sm px-2 md:px-3">
                  Wszystkie ({allTemplates.length})
                </TabsTrigger>
                <TabsTrigger value="builtin" className="text-xs md:text-sm px-2 md:px-3">
                  Wbudowane ({allTemplates.filter(t => t.isBuiltIn).length})
                </TabsTrigger>
                <TabsTrigger value="custom" className="text-xs md:text-sm px-2 md:px-3">
                  Własne ({allTemplates.filter(t => !t.isBuiltIn).length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.length === 0 && (
          <Card className="col-span-full border-dashed">
            <CardContent className="p-12 text-center">
              <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'Nie znaleziono szablonów' : 'Brak szablonów'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Stwórz pierwszy szablon
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onEdit={() => setEditingTemplateId(template.id)}
            onDuplicate={() => handleDuplicate(template)}
            onExport={() => handleExport(template)}
            onDelete={() => handleDelete(template)}
          />
        ))}
      </div>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Importuj szablon</DialogTitle>
            <DialogDescription>
              Wklej JSON szablonu checklisty
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              className="w-full h-64 p-3 border rounded-lg font-mono text-sm"
              placeholder='{"id": "...", "name": "...", ...}'
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                Anuluj
              </Button>
              <Button onClick={handleImport}>
                <Upload className="w-4 h-4 mr-2" />
                Importuj
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Karta pojedynczego szablonu
interface TemplateCardProps {
  template: ChecklistTemplate;
  onEdit: () => void;
  onDuplicate: () => void;
  onExport: () => void;
  onDelete: () => void;
}

function TemplateCard({ template, onEdit, onDuplicate, onExport, onDelete }: TemplateCardProps) {
  const totalItems = template.categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const typeLabel = INCIDENT_TYPE_LABELS[template.incidentType];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2 md:pb-3 p-3 md:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1.5 md:space-y-2 min-w-0">
            <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
              <CardTitle className="text-base md:text-lg">{template.name}</CardTitle>
              {template.isBuiltIn && (
                <Badge variant="outline" className="text-xs">
                  <Lock className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Wbudowany</span>
                </Badge>
              )}
            </div>
            {template.description && (
              <CardDescription className="text-xs md:text-sm line-clamp-2">
                {template.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4 p-3 md:p-6 pt-0">
        <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">{typeLabel}</Badge>
          <Badge variant="outline" className="text-xs">{template.categories.length} kategorii</Badge>
          <Badge variant="outline" className="text-xs">{totalItems} zadań</Badge>
        </div>

        {template.updatedAt && !template.isBuiltIn && (
          <p className="text-xs text-gray-500">
            Zaktualizowano: {format(new Date(template.updatedAt), 'dd MMM yyyy, HH:mm', { locale: pl })}
          </p>
        )}

        <div className="flex gap-1 md:gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={onEdit} className="flex-1 h-8 md:h-9 text-xs md:text-sm px-2 md:px-3">
            <Edit className="w-3 h-3 md:mr-1" />
            <span className="hidden sm:inline">{template.isBuiltIn ? 'Zobacz' : 'Edytuj'}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onDuplicate} className="h-8 w-8 md:h-9 md:w-9 p-0">
            <Copy className="w-3 h-3" />
          </Button>
          <Button variant="outline" size="sm" onClick={onExport} className="h-8 w-8 md:h-9 md:w-9 p-0">
            <Download className="w-3 h-3" />
          </Button>
          {!template.isBuiltIn && (
            <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700 h-8 w-8 md:h-9 md:w-9 p-0">
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

