'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { ChecklistCategory, ChecklistItem as ChecklistItemType, ChecklistItemStatus, Priority } from '@/types/incident';
import { useIncidentStore } from '@/store/incident-store';
import RotationTimer from './rotation-timer';
import ChecklistToolbar from './checklist-toolbar';
import ChecklistItemComponent from './checklist-item-v2';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface ChecklistViewV2Props {
  categories: ChecklistCategory[];
  onCriticalRotation?: (isCritical: boolean) => void;
}

export default function ChecklistViewV2({ categories, onCriticalRotation }: ChecklistViewV2Props) {
  // State
  const [activeRotation, setActiveRotation] = useState<1 | 2 | null>(null);
  const [viewMode, setViewMode] = useState<'normal' | 'compact'>('compact');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Computed values
  const allItems = useMemo(() => {
    return categories.flatMap(cat =>
      cat.items.map(item => ({ ...item, categoryId: cat.id, categoryName: cat.name }))
    );
  }, [categories]);

  // Calculate simple statistics
  const stats = useMemo(() => {
    const total = allItems.length;
    const completed = allItems.filter(item => item.status === 'COMPLETED').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, percentage };
  }, [allItems]);

  // Bulk actions
  const handleSelectAll = useCallback(() => {
    const allItemIds = new Set(
      categories.flatMap(cat => cat.items.map(item => item.id))
    );
    setSelectedItems(allItemIds);
  }, [categories]);

  const handleDeselectAll = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  const handleBulkComplete = useCallback(() => {
    // TODO: Implement bulk complete
    console.log('Bulk complete:', Array.from(selectedItems));
    setSelectedItems(new Set());
  }, [selectedItems]);

  const handleToggleSelect = useCallback((itemId: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + A - Select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        handleSelectAll();
      }
      // Escape - Deselect all
      if (e.key === 'Escape') {
        handleDeselectAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectAll, handleDeselectAll]);

  const getCategoryProgress = (category: ChecklistCategory) => {
    const total = category.items.length;
    const completed = category.items.filter(item => item.status === 'COMPLETED').length;
    const inProgress = category.items.filter(item => item.status === 'IN_PROGRESS').length;
    return {
      completed,
      inProgress,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  return (
    <div className="space-y-3">
      {/* Progress - jedna linia */}
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-sm">Postęp</span>
        </div>
        <div className="flex-1">
          <Progress value={stats.percentage} className="h-2" />
        </div>
        <Badge variant="outline" className="font-mono text-sm">
          {stats.completed}/{stats.total} • {stats.percentage}%
        </Badge>
      </div>

      {/* Rotation Timer */}
      <RotationTimer
        onRotationChange={setActiveRotation}
        onCriticalStateChange={onCriticalRotation}
      />

      {/* Toolbar */}
      <ChecklistToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedCount={selectedItems.size}
        totalCount={allItems.length}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onBulkComplete={handleBulkComplete}
      />

      {/* Categories */}
      <div className="space-y-2">
        {categories.sort((a, b) => a.order - b.order).map((category) => {
          const progress = getCategoryProgress(category);
          const isComplete = progress.percentage === 100;

          return (
            <Card
              key={category.id}
              className={cn(
                'overflow-hidden transition-all duration-200 hover:shadow-md',
                isComplete && 'border-green-500 bg-green-50/20'
              )}
            >
              {/* Category Header - kompaktowy */}
              <div className="px-3 py-2 flex items-center justify-between bg-gray-50 border-b">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {isComplete && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                  <h3 className="text-sm font-bold truncate">{category.name}</h3>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-600">
                    {progress.completed}/{progress.total}
                  </span>
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all duration-300',
                        isComplete ? 'bg-green-500' : 'bg-blue-500'
                      )}
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <span className={cn(
                    'text-xs font-bold w-8 text-right',
                    isComplete ? 'text-green-600' : 'text-gray-700'
                  )}>
                    {progress.percentage}%
                  </span>
                </div>
              </div>

              {/* Items - kompaktowe */}
              <div className="p-2 space-y-0.5">
                {category.items.map((item) => (
                  <ChecklistItemComponent
                    key={item.id}
                    item={item}
                    categoryId={category.id}
                    compact={viewMode === 'compact'}
                    selected={selectedItems.has(item.id)}
                    onToggleSelect={handleToggleSelect}
                  />
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

