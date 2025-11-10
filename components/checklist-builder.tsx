'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronDown, 
  ChevronRight,
  Save,
  X,
  AlertCircle,
  Flame,
  FolderOpen,
} from 'lucide-react';
import { ChecklistTemplate, ChecklistTemplateCategory, ChecklistTemplateItem, Priority, IncidentType } from '@/types/incident';
import { useChecklistStore } from '@/store/checklist-store';
import { cn } from '@/lib/utils';

interface ChecklistBuilderProps {
  templateId?: string; // Jeśli podane, edytujemy istniejący szablon
  onSave?: () => void;
  onCancel?: () => void;
}

const PRIORITY_OPTIONS: { value: Priority; label: string; emoji: string }[] = [
  { value: 'LOW', label: 'Niski', emoji: 'ℹ️' },
  { value: 'MEDIUM', label: 'Średni', emoji: '⚡' },
  { value: 'HIGH', label: 'Wysoki', emoji: '⚠️' },
  { value: 'CRITICAL', label: 'Krytyczny', emoji: '🚨' },
];

const INCIDENT_TYPE_OPTIONS: { value: IncidentType | 'CUSTOM'; label: string }[] = [
  { value: 'CUSTOM', label: 'Własny szablon' },
  { value: 'FIRE_BUILDING', label: 'Pożar budynku' },
  { value: 'FIRE_FOREST', label: 'Pożar lasu' },
  { value: 'FIRE_VEHICLE', label: 'Pożar pojazdu' },
  { value: 'FIRE_OUTDOOR', label: 'Pożar otwarty' },
  { value: 'ACCIDENT_ROAD', label: 'Wypadek drogowy' },
  { value: 'ACCIDENT_INDUSTRIAL', label: 'Wypadek przemysłowy' },
  { value: 'HAZMAT_CHEMICAL', label: 'Zagrożenie chemiczne' },
  { value: 'HAZMAT_ECOLOGICAL', label: 'Zagrożenie ekologiczne' },
  { value: 'RESCUE_WATER', label: 'Ratownictwo wodne' },
  { value: 'RESCUE_HEIGHT', label: 'Ratownictwo wysokościowe' },
  { value: 'RESCUE_TECHNICAL', label: 'Ratownictwo techniczne' },
  { value: 'FLOOD', label: 'Powódź' },
  { value: 'STORM', label: 'Burza/Wichura' },
  { value: 'OTHER', label: 'Inne' },
];

export function ChecklistBuilder({ templateId, onSave, onCancel }: ChecklistBuilderProps) {
  // Pobierz customTemplates reaktywnie
  const customTemplates = useChecklistStore(state => state.customTemplates);
  const getTemplateById = useChecklistStore(state => state.getTemplateById);
  const createTemplate = useChecklistStore(state => state.createTemplate);
  const updateTemplate = useChecklistStore(state => state.updateTemplate);

  // Załaduj istniejący szablon lub stwórz nowy - będzie reaktywne bo customTemplates jest reaktywne
  const existingTemplate = templateId ? getTemplateById(templateId) : undefined;

  const [name, setName] = useState(existingTemplate?.name || '');
  const [description, setDescription] = useState(existingTemplate?.description || '');
  const [incidentType, setIncidentType] = useState<IncidentType | 'CUSTOM'>(existingTemplate?.incidentType || 'CUSTOM');
  const [categories, setCategories] = useState<ChecklistTemplateCategory[]>(existingTemplate?.categories || []);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<{ categoryId: string; itemId?: string } | null>(null);

  // Synchronizuj stan lokalny gdy szablon się zmieni w store
  useEffect(() => {
    if (existingTemplate && templateId) {
      console.log('🔄 Synchronizacja stanu z store:', {
        templateId,
        name: existingTemplate.name,
        categoriesCount: existingTemplate.categories.length,
        updatedAt: existingTemplate.updatedAt,
      });
      setName(existingTemplate.name);
      setDescription(existingTemplate.description || '');
      setIncidentType(existingTemplate.incidentType);
      setCategories(existingTemplate.categories);
    }
  }, [templateId, existingTemplate?.updatedAt?.getTime(), customTemplates.length]); // Zależność od updatedAt i liczby szablonów

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const addCategory = () => {
    const newCategory: ChecklistTemplateCategory = {
      id: `cat-${Date.now()}`,
      name: 'Nowa kategoria',
      order: categories.length + 1,
      items: [],
    };
    setCategories([...categories, newCategory]);
    setExpandedCategories(prev => new Set([...prev, newCategory.id]));
  };

  const updateCategory = (categoryId: string, updates: Partial<ChecklistTemplateCategory>) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId ? { ...cat, ...updates } : cat
    ));
  };

  const deleteCategory = (categoryId: string) => {
    console.log('🗑️ Usuwanie kategorii:', categoryId);
    const newCategories = categories.filter(cat => cat.id !== categoryId);
    console.log('📊 Kategorie przed:', categories.length, 'po:', newCategories.length);
    setCategories(newCategories);
    setExpandedCategories(prev => {
      const next = new Set(prev);
      next.delete(categoryId);
      return next;
    });
  };

  const addItem = (categoryId: string) => {
    const newItem: ChecklistTemplateItem = {
      id: `item-${Date.now()}`,
      title: 'Nowe zadanie',
      description: '',
      priority: 'MEDIUM',
      estimatedDuration: 5,
    };
    
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, items: [...cat.items, newItem] }
        : cat
    ));
    
    setEditingItem({ categoryId, itemId: newItem.id });
  };

  const updateItem = (categoryId: string, itemId: string, updates: Partial<ChecklistTemplateItem>) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            items: cat.items.map(item =>
              item.id === itemId ? { ...item, ...updates } : item
            ),
          }
        : cat
    ));
  };

  const deleteItem = (categoryId: string, itemId: string) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, items: cat.items.filter(item => item.id !== itemId) }
        : cat
    ));
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Podaj nazwę szablonu');
      return;
    }

    if (categories.length === 0) {
      alert('Dodaj przynajmniej jedną kategorię');
      return;
    }

    try {
      if (existingTemplate) {
        // Aktualizuj istniejący szablon (wbudowany lub custom)
        console.log('💾 Zapisywanie szablonu:', {
          id: existingTemplate.id,
          name: name.trim(),
          categoriesCount: categories.length,
          categories: categories.map(c => ({ id: c.id, name: c.name })),
        });
        updateTemplate(existingTemplate.id, {
          name: name.trim(),
          description: description.trim(),
          incidentType,
          categories,
        });
        alert(`✅ Szablon "${name.trim()}" został zaktualizowany!`);
      } else {
        // Stwórz nowy szablon
        console.log('💾 Tworzenie nowego szablonu:', {
          name: name.trim(),
          categoriesCount: categories.length,
        });
        createTemplate({
          name: name.trim(),
          description: description.trim(),
          incidentType,
          categories,
        });
        alert(`✅ Szablon "${name.trim()}" został utworzony!`);
      }

      // Wywołaj callback po zapisaniu
      onSave?.();
    } catch (error) {
      alert('❌ Błąd podczas zapisywania szablonu');
      console.error(error);
    }
  };

  return (
    <div className="space-y-3 md:space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="p-3 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-red-100 rounded-lg">
                <Flame className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg md:text-2xl">
                  {existingTemplate ? 'Edytuj szablon' : 'Nowy szablon checklisty'}
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Stwórz własną checklistę dla działań ratowniczych
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-1.5 md:gap-2 w-full md:w-auto">
              <Button variant="outline" onClick={onCancel} className="flex-1 md:flex-none h-8 md:h-10 text-xs md:text-sm px-2 md:px-4">
                <X className="w-3.5 h-3.5 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden sm:inline">Anuluj</span>
              </Button>
              <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700 flex-1 md:flex-none h-8 md:h-10 text-xs md:text-sm px-2 md:px-4">
                <Save className="w-3.5 h-3.5 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden sm:inline">Zapisz</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4 p-3 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-xs md:text-sm font-medium">Nazwa szablonu *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="np. Pożar budynku mieszkalnego"
                className="text-sm h-9 md:h-10"
              />
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-xs md:text-sm font-medium">Typ zdarzenia</label>
              <Select
                value={incidentType}
                onValueChange={(v) => setIncidentType(v as IncidentType | 'CUSTOM')}
              >
                <SelectTrigger className="text-sm h-9 md:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INCIDENT_TYPE_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className="text-sm">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5 md:space-y-2">
            <label className="text-xs md:text-sm font-medium">Opis (opcjonalnie)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Krótki opis szablonu..."
              rows={2}
              className="text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base md:text-lg font-semibold flex items-center gap-1.5 md:gap-2">
            <FolderOpen className="w-4 h-4 md:w-5 md:h-5" />
            Kategorie ({categories.length})
          </h3>
          {!existingTemplate?.isBuiltIn && (
            <Button onClick={addCategory} size="sm" className="h-8 md:h-9 text-xs md:text-sm px-2 md:px-3">
              <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden sm:inline">Dodaj kategorię</span>
            </Button>
          )}
        </div>

        {categories.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-6 md:p-12 text-center">
              <AlertCircle className="w-8 h-8 md:w-12 md:h-12 text-gray-400 mx-auto mb-2 md:mb-4" />
              <p className="text-gray-500 text-sm md:text-base">Brak kategorii. Dodaj pierwszą kategorię aby rozpocząć.</p>
            </CardContent>
          </Card>
        )}

        {categories.map((category, catIndex) => (
          <CategoryEditor
            key={category.id}
            category={category}
            isExpanded={expandedCategories.has(category.id)}
            onToggle={() => toggleCategory(category.id)}
            onUpdate={(updates) => updateCategory(category.id, updates)}
            onDelete={() => deleteCategory(category.id)}
            onAddItem={() => addItem(category.id)}
            onUpdateItem={(itemId, updates) => updateItem(category.id, itemId, updates)}
            onDeleteItem={(itemId) => deleteItem(category.id, itemId)}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
          />
        ))}
      </div>
    </div>
  );
}

// Komponent do edycji kategorii
interface CategoryEditorProps {
  category: ChecklistTemplateCategory;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (updates: Partial<ChecklistTemplateCategory>) => void;
  onDelete: () => void;
  onAddItem: () => void;
  onUpdateItem: (itemId: string, updates: Partial<ChecklistTemplateItem>) => void;
  onDeleteItem: (itemId: string) => void;
  editingItem: { categoryId: string; itemId?: string } | null;
  setEditingItem: (item: { categoryId: string; itemId?: string } | null) => void;
}

function CategoryEditor({
  category,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  editingItem,
  setEditingItem,
}: CategoryEditorProps) {
  return (
    <Card>
      <div className="p-2 md:p-4 flex items-center justify-between border-b gap-2">
        <div className="flex items-center gap-1.5 md:gap-3 flex-1 min-w-0">
          <Button variant="ghost" size="sm" onClick={onToggle} className="h-7 w-7 md:h-8 md:w-8 p-0 flex-shrink-0">
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />}
          </Button>
          <GripVertical className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 hidden sm:block flex-shrink-0" />
          <Input
            value={category.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="font-semibold border-none shadow-none focus-visible:ring-0 px-1 md:px-2 text-sm md:text-base h-8 md:h-10"
            placeholder="Nazwa kategorii"
          />
          <Badge variant="outline" className="text-xs whitespace-nowrap flex-shrink-0">{category.items.length} zadań</Badge>
        </div>
        <div className="flex gap-1 md:gap-2 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={onAddItem} className="h-7 w-7 md:h-8 md:w-8 p-0">
            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700 h-7 w-7 md:h-8 md:w-8 p-0">
            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <CardContent className="p-2 md:p-4 space-y-1.5 md:space-y-2">
          {category.items.length === 0 && (
            <div className="text-center py-4 md:py-8 text-gray-500 text-xs md:text-sm">
              Brak zadań. Kliknij + aby dodać pierwsze zadanie.
            </div>
          )}
          
          {category.items.map((item) => (
            <ItemEditor
              key={item.id}
              item={item}
              categoryId={category.id}
              isEditing={editingItem?.categoryId === category.id && editingItem?.itemId === item.id}
              onStartEdit={() => setEditingItem({ categoryId: category.id, itemId: item.id })}
              onStopEdit={() => setEditingItem(null)}
              onUpdate={(updates) => onUpdateItem(item.id, updates)}
              onDelete={() => onDeleteItem(item.id)}
            />
          ))}
        </CardContent>
      )}
    </Card>
  );
}

// Komponent do edycji pojedynczego zadania
interface ItemEditorProps {
  item: ChecklistTemplateItem;
  categoryId: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
  onUpdate: (updates: Partial<ChecklistTemplateItem>) => void;
  onDelete: () => void;
}

function ItemEditor({
  item,
  isEditing,
  onStartEdit,
  onStopEdit,
  onUpdate,
  onDelete,
}: ItemEditorProps) {
  const priorityOption = PRIORITY_OPTIONS.find(p => p.value === item.priority);

  if (!isEditing) {
    return (
      <div
        onClick={onStartEdit}
        className="p-2 md:p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
      >
        <div className="flex items-start justify-between gap-2 md:gap-3">
          <div className="flex items-start gap-1.5 md:gap-3 flex-1 min-w-0">
            <GripVertical className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 mt-0.5 md:mt-1 hidden sm:block flex-shrink-0" />
            <div className="flex-1 space-y-1 min-w-0">
              <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                <span className="font-medium text-sm md:text-base">{item.title}</span>
                <Badge variant="outline" className="text-xs">
                  {priorityOption?.emoji} <span className="hidden sm:inline">{priorityOption?.label}</span>
                </Badge>
                {item.estimatedDuration && (
                  <Badge variant="outline" className="text-xs">
                    ~{item.estimatedDuration} min
                  </Badge>
                )}
              </div>
              {item.description && (
                <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{item.description}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 h-7 w-7 md:h-8 md:w-8 p-0 flex-shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-2 border-blue-500">
      <CardContent className="p-3 md:p-4 space-y-3 md:space-y-4">
        <div className="space-y-1.5 md:space-y-2">
          <label className="text-xs md:text-sm font-medium">Tytuł zadania *</label>
          <Input
            value={item.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="np. Ocena sytuacji"
            autoFocus
            className="text-sm h-9 md:h-10"
          />
        </div>

        <div className="space-y-1.5 md:space-y-2">
          <label className="text-xs md:text-sm font-medium">Opis (opcjonalnie)</label>
          <Textarea
            value={item.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Szczegółowy opis zadania..."
            rows={2}
            className="text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <div className="space-y-1.5 md:space-y-2">
            <label className="text-xs md:text-sm font-medium">Priorytet</label>
            <Select
              value={item.priority}
              onValueChange={(v) => onUpdate({ priority: v as Priority })}
            >
              <SelectTrigger className="text-sm h-9 md:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className="text-sm">
                    {opt.emoji} {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <label className="text-xs md:text-sm font-medium">Czas (min)</label>
            <Input
              type="number"
              value={item.estimatedDuration || ''}
              onChange={(e) => onUpdate({ estimatedDuration: parseInt(e.target.value) || undefined })}
              placeholder="5"
              min="1"
              className="text-sm h-9 md:h-10"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={onStopEdit} className="h-8 md:h-9 text-xs md:text-sm">
            Gotowe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

