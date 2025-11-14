'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Trash2, X, Clock, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Photo {
  id: string;
  url: string;
  description: string;
  timestamp: Date;
}

export default function PhotosList() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto: Photo = {
          id: Date.now().toString() + Math.random(),
          url: event.target?.result as string,
          description: '',
          timestamp: new Date(),
        };
        setPhotos(prev => [newPhoto, ...prev]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCameraCapture = () => {
    // Trigger file input with camera
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Czy na pewno usunąć zdjęcie?')) {
      setPhotos(photos.filter(p => p.id !== id));
      if (selectedPhoto?.id === id) {
        setSelectedPhoto(null);
      }
    }
  };

  const updateDescription = (id: string, description: string) => {
    setPhotos(photos.map(p => 
      p.id === id ? { ...p, description } : p
    ));
  };

  return (
    <div className="space-y-3">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Zdjęcia</h3>
          <p className="text-sm text-gray-500">
            {photos.length} {photos.length === 1 ? 'zdjęcie' : 'zdjęć'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCameraCapture}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Camera className="w-4 h-4 mr-2" />
            Zrób zdjęcie
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
          >
            <Upload className="w-4 h-4 mr-2" />
            Wgraj
          </Button>
        </div>
      </div>

      {/* Grid */}
      {photos.length === 0 ? (
        <Card className="p-8 text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Brak zdjęć</p>
          <p className="text-xs text-gray-400 mt-1">Kliknij "Zrób zdjęcie" lub "Wgraj" aby dodać</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <Card
              key={photo.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-square relative bg-gray-100">
                <img
                  src={photo.url}
                  alt={photo.description || 'Zdjęcie'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(photo.id);
                  }}
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="p-2">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Clock className="w-3 h-3" />
                  {photo.timestamp.toLocaleTimeString('pl-PL')}
                </div>
                {photo.description && (
                  <p className="text-xs text-gray-700 truncate">{photo.description}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="max-w-4xl w-full bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {selectedPhoto.timestamp.toLocaleString('pl-PL')}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleDelete(selectedPhoto.id)}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Usuń
                </Button>
                <Button
                  onClick={() => setSelectedPhoto(null)}
                  size="sm"
                  variant="ghost"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="max-h-[60vh] overflow-auto bg-gray-100">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.description || 'Zdjęcie'}
                className="w-full h-auto"
              />
            </div>

            {/* Description */}
            <div className="p-4 border-t">
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Opis zdjęcia
              </label>
              <Input
                value={selectedPhoto.description}
                onChange={(e) => {
                  updateDescription(selectedPhoto.id, e.target.value);
                  setSelectedPhoto({ ...selectedPhoto, description: e.target.value });
                }}
                placeholder="Dodaj opis..."
                className="text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

