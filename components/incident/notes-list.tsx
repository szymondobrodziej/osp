'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, StickyNote, Trash2, Edit2, Check, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Note {
  id: string;
  content: string;
  timestamp: string; // Changed to string for localStorage
  important: boolean;
}

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('incident-notes');
    if (stored) {
      try {
        setNotes(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load notes:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('incident-notes', JSON.stringify(notes));
    }
  }, [notes, isLoaded]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  const handleAdd = () => {
    if (!content.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      content: content.trim(),
      timestamp: new Date().toISOString(),
      important: isImportant,
    };

    setNotes([newNote, ...notes]);
    setContent('');
    setIsImportant(false);
    setIsAdding(false);
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setContent(note.content);
    setIsImportant(note.important);
  };

  const handleUpdate = () => {
    if (!editingId || !content.trim()) return;

    setNotes(notes.map(n => 
      n.id === editingId 
        ? { ...n, content: content.trim(), important: isImportant }
        : n
    ));
    setEditingId(null);
    setContent('');
    setIsImportant(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Czy na pewno usunąć notatkę?')) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  const toggleImportant = (id: string) => {
    setNotes(notes.map(n => 
      n.id === id ? { ...n, important: !n.important } : n
    ));
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">Notatki</h3>
          <p className="text-sm text-gray-500">
            {notes.length} {notes.length === 1 ? 'notatka' : 'notatek'}
            {notes.filter(n => n.important).length > 0 && (
              <span className="text-red-600 font-semibold ml-2">
                ({notes.filter(n => n.important).length} ważnych)
              </span>
            )}
          </p>
        </div>
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto h-12 sm:h-10"
        >
          <Plus className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
          <span className="ml-2 sm:ml-0">Dodaj notatkę</span>
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card className="p-4 border-2 border-blue-500">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Treść notatki *
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Wpisz notatkę..."
                rows={4}
                className="text-sm"
                autoFocus
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="important"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className="w-5 h-5 sm:w-4 sm:h-4"
              />
              <label htmlFor="important" className="text-sm sm:text-sm font-medium cursor-pointer">
                🚨 Oznacz jako ważne
              </label>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={editingId ? handleUpdate : handleAdd}
                className="flex-1 bg-green-600 hover:bg-green-700 h-12 sm:h-10"
                disabled={!content.trim()}
              >
                <Check className="w-4 h-4 mr-2" />
                {editingId ? 'Zapisz' : 'Dodaj'}
              </Button>
              <Button
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setContent('');
                  setIsImportant(false);
                }}
                variant="outline"
                className="flex-1 sm:flex-none h-12 sm:h-10"
              >
                <X className="w-4 h-4 mr-2" />
                Anuluj
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* List */}
      <div className="space-y-2">
        {notes.length === 0 ? (
          <Card className="p-8 text-center">
            <StickyNote className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Brak notatek</p>
            <p className="text-xs text-gray-400 mt-1">Kliknij "Dodaj notatkę" aby dodać</p>
          </Card>
        ) : (
          notes.map((note) => (
            <Card
              key={note.id}
              className={cn(
                'p-3 transition-all border-l-4',
                note.important ? 'border-red-500 bg-red-50/30' : 'border-blue-500',
                editingId === note.id && 'ring-2 ring-blue-500'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {note.important && (
                      <Badge className="bg-red-600 text-xs">
                        🚨 Ważne
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {new Date(note.timestamp).toLocaleString('pl-PL')}
                    </div>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    onClick={() => toggleImportant(note.id)}
                    size="sm"
                    variant="ghost"
                    className={cn(
                      'h-10 w-10 sm:h-8 sm:w-8 p-0',
                      note.important && 'text-red-600 hover:text-red-700'
                    )}
                    title={note.important ? 'Usuń oznaczenie ważne' : 'Oznacz jako ważne'}
                  >
                    <span className="text-lg sm:text-base">{note.important ? '🚨' : '⭐'}</span>
                  </Button>
                  <Button
                    onClick={() => handleEdit(note)}
                    size="sm"
                    variant="ghost"
                    className="h-10 w-10 sm:h-8 sm:w-8 p-0"
                  >
                    <Edit2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(note.id)}
                    size="sm"
                    variant="ghost"
                    className="h-10 w-10 sm:h-8 sm:w-8 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

