'use client';

import { useState } from 'react';
import { useVehicleEquipmentStore } from '@/store/vehicle-equipment-store';
import { VehicleConfiguration, EquipmentItem, VehicleCompartment, EquipmentCategory, EQUIPMENT_CATEGORY_LABELS } from '@/types/vehicle-equipment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Package,
  FolderPlus,
} from 'lucide-react';

interface VehicleEquipmentEditorProps {
  vehicle: VehicleConfiguration;
}

export function VehicleEquipmentEditor({ vehicle }: VehicleEquipmentEditorProps) {
  const { addEquipmentItem, updateEquipmentItem, deleteEquipmentItem, addCompartment, updateCompartment, deleteCompartment } = useVehicleEquipmentStore();
  
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isAddingCompartment, setIsAddingCompartment] = useState(false);
  const [editingItem, setEditingItem] = useState<{ compartmentId: string; item: EquipmentItem } | null>(null);
  const [selectedCompartmentId, setSelectedCompartmentId] = useState<string>(vehicle.compartments[0]?.id || '');

  // Formularz nowego elementu
  const [newItem, setNewItem] = useState<Omit<EquipmentItem, 'id'>>({
    name: '',
    category: 'OTHER',
    quantity: 1,
    unit: 'szt',
    description: '',
    location: selectedCompartmentId,
  });

  // Formularz nowego schowka
  const [newCompartment, setNewCompartment] = useState({
    id: '',
    name: '',
    description: '',
    color: '#94a3b8',
    position: { x: 50, y: 50 },
    size: { width: 20, height: 20 },
  });

  const handleAddItem = () => {
    if (!newItem.name || !selectedCompartmentId) return;
    
    addEquipmentItem(vehicle.id, selectedCompartmentId, newItem);
    setNewItem({
      name: '',
      category: 'OTHER',
      quantity: 1,
      unit: 'szt',
      description: '',
      location: selectedCompartmentId,
    });
    setIsAddingItem(false);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    
    updateEquipmentItem(
      vehicle.id,
      editingItem.compartmentId,
      editingItem.item.id,
      editingItem.item
    );
    setEditingItem(null);
  };

  const handleDeleteItem = (compartmentId: string, itemId: string) => {
    if (confirm('Czy na pewno chcesz usunąć ten element?')) {
      deleteEquipmentItem(vehicle.id, compartmentId, itemId);
    }
  };

  const handleAddCompartment = () => {
    if (!newCompartment.id || !newCompartment.name) return;
    
    addCompartment(vehicle.id, newCompartment);
    setNewCompartment({
      id: '',
      name: '',
      description: '',
      color: '#94a3b8',
      position: { x: 50, y: 50 },
      size: { width: 20, height: 20 },
    });
    setIsAddingCompartment(false);
  };

  const handleDeleteCompartment = (compartmentId: string) => {
    const compartment = vehicle.compartments.find(c => c.id === compartmentId);
    if (!compartment) return;
    
    if (compartment.items.length > 0) {
      if (!confirm(`Schowek "${compartment.name}" zawiera ${compartment.items.length} elementów. Czy na pewno chcesz go usunąć?`)) {
        return;
      }
    }
    
    deleteCompartment(vehicle.id, compartmentId);
    if (selectedCompartmentId === compartmentId) {
      setSelectedCompartmentId(vehicle.compartments[0]?.id || '');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Zarządzanie schowkami */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base md:text-lg">Schowki pojazdu</CardTitle>
              <CardDescription className="text-xs md:text-sm">Zarządzaj schowkami i ich zawartością</CardDescription>
            </div>
            <Dialog open={isAddingCompartment} onOpenChange={setIsAddingCompartment}>
              <DialogTrigger asChild>
                <Button size="sm" className="md:size-default w-full sm:w-auto">
                  <FolderPlus className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                  <span className="hidden sm:inline">Dodaj schowek</span>
                  <span className="sm:hidden">Nowy schowek</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nowy schowek</DialogTitle>
                  <DialogDescription>Dodaj nowy schowek do pojazdu</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">ID schowka</label>
                    <Input
                      value={newCompartment.id}
                      onChange={(e) => setNewCompartment({ ...newCompartment, id: e.target.value })}
                      placeholder="np. comp-left-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nazwa</label>
                    <Input
                      value={newCompartment.name}
                      onChange={(e) => setNewCompartment({ ...newCompartment, name: e.target.value })}
                      placeholder="np. Schowek lewy przedni"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Opis</label>
                    <Textarea
                      value={newCompartment.description}
                      onChange={(e) => setNewCompartment({ ...newCompartment, description: e.target.value })}
                      placeholder="Opcjonalny opis"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Kolor</label>
                    <Input
                      type="color"
                      value={newCompartment.color}
                      onChange={(e) => setNewCompartment({ ...newCompartment, color: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddCompartment} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Zapisz schowek
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {vehicle.compartments.map((compartment) => (
              <Card
                key={compartment.id}
                className={`cursor-pointer transition-all ${
                  selectedCompartmentId === compartment.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCompartmentId(compartment.id)}
                style={{ borderLeft: `4px solid ${compartment.color}` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-sm">{compartment.name}</CardTitle>
                      {compartment.description && (
                        <CardDescription className="text-xs mt-1">
                          {compartment.description}
                        </CardDescription>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCompartment(compartment.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="text-xs">
                    {compartment.items.reduce((sum, item) => sum + item.quantity, 0)} elementów
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Zarządzanie wyposażeniem */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base md:text-lg">Wyposażenie</CardTitle>
              <CardDescription className="text-xs md:text-sm truncate">
                {selectedCompartmentId
                  ? `Edytuj zawartość: ${vehicle.compartments.find(c => c.id === selectedCompartmentId)?.name}`
                  : 'Wybierz schowek aby edytować jego zawartość'}
              </CardDescription>
            </div>
            <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
              <DialogTrigger asChild>
                <Button disabled={!selectedCompartmentId} size="sm" className="md:size-default w-full sm:w-auto">
                  <Plus className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                  <span className="hidden sm:inline">Dodaj element</span>
                  <span className="sm:hidden">Nowy element</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nowy element wyposażenia</DialogTitle>
                  <DialogDescription>
                    Dodaj nowy element do schowka: {vehicle.compartments.find(c => c.id === selectedCompartmentId)?.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nazwa</label>
                    <Input
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="np. Wąż W75"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Kategoria</label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => setNewItem({ ...newItem, category: value as EquipmentCategory })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(EQUIPMENT_CATEGORY_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Ilość</label>
                      <Input
                        type="number"
                        min="1"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Jednostka</label>
                      <Input
                        value={newItem.unit}
                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                        placeholder="szt"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Opis (opcjonalnie)</label>
                    <Textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      placeholder="Dodatkowe informacje"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Termin ważności (opcjonalnie)</label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={newItem.expiryDate || ''}
                        onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value || undefined })}
                        className="flex-1"
                      />
                      {newItem.expiryDate && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setNewItem({ ...newItem, expiryDate: undefined })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pozostaw puste jeśli element nie ma terminu ważności
                    </p>
                  </div>
                  <Button onClick={handleAddItem} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Dodaj element
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {selectedCompartmentId ? (
            <div className="space-y-2">
              {vehicle.compartments
                .find(c => c.id === selectedCompartmentId)
                ?.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm md:text-base truncate">{item.name}</div>
                      {item.description && (
                        <div className="text-xs md:text-sm text-muted-foreground truncate">{item.description}</div>
                      )}
                      <div className="flex gap-1 md:gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className="text-[10px] md:text-xs">
                          {EQUIPMENT_CATEGORY_LABELS[item.category]}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] md:text-xs">
                          {item.quantity} {item.unit}
                        </Badge>
                        {item.expiryDate && (
                          <Badge
                            variant={new Date(item.expiryDate) < new Date() ? "destructive" : "default"}
                            className="text-[10px] md:text-xs"
                          >
                            📅 {new Date(item.expiryDate).toLocaleDateString('pl-PL')}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingItem({ compartmentId: selectedCompartmentId, item })}
                      >
                        <Edit className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(selectedCompartmentId, item.id)}
                      >
                        <Trash2 className="h-3 w-3 md:h-4 md:w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                )) || <p className="text-muted-foreground text-center py-8 text-sm">Brak elementów w tym schowku</p>}
            </div>
          ) : (
            <div className="text-center py-8 md:py-12">
              <Package className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-muted-foreground text-sm md:text-base">Wybierz schowek aby zobaczyć jego zawartość</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog edycji elementu */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edytuj element</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nazwa</label>
                <Input
                  value={editingItem.item.name}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, name: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Kategoria</label>
                <Select
                  value={editingItem.item.category}
                  onValueChange={(value) =>
                    setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, category: value as EquipmentCategory },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EQUIPMENT_CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Ilość</label>
                  <Input
                    type="number"
                    min="1"
                    value={editingItem.item.quantity}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, quantity: parseInt(e.target.value) || 1 },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Jednostka</label>
                  <Input
                    value={editingItem.item.unit}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, unit: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Opis</label>
                <Textarea
                  value={editingItem.item.description}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, description: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Termin ważności (opcjonalnie)</label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={editingItem.item.expiryDate || ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, expiryDate: e.target.value || undefined },
                      })
                    }
                    className="flex-1"
                  />
                  {editingItem.item.expiryDate && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditingItem({
                          ...editingItem,
                          item: { ...editingItem.item, expiryDate: undefined },
                        })
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Pozostaw puste jeśli element nie ma terminu ważności
                </p>
              </div>
              <Button onClick={handleUpdateItem} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Zapisz zmiany
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

