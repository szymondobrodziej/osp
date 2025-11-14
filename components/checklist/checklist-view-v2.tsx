'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { ChecklistCategory, ChecklistItem as ChecklistItemType, ChecklistItemStatus, Priority } from '@/types/incident';
import { useIncidentStore } from '@/store/incident-store';
import ChecklistFiltersComponent, { ChecklistFilters } from './checklist-filters';
import ChecklistToolbar from './checklist-toolbar';
import ChecklistItemComponent from './checklist-item-v2';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface ChecklistViewV2Props {
  categories: ChecklistCategory[];
}

export default function ChecklistViewV2({ categories }: ChecklistViewV2Props) {
  // State
  const [filters, setFilters] = useState<ChecklistFilters>({
    search: '',
    status: 'ALL',
    priority: 'ALL',
    category: 'ALL',
  });
  const [viewMode, setViewMode] = useState<'normal' | 'compact'>('compact');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Computed values
  const allItems = useMemo(() => {
    return categories.flatMap(cat =>
      cat.items.map(item => ({ ...item, categoryId: cat.id, categoryName: cat.name }))
    );
  }, [categories]);

  // Filter items
  const filteredCategories = useMemo(() => {
    return categories
      .map(category => {
        // Filter by category
        if (filters.category !== 'ALL' && category.id !== filters.category) {
          return null;
        }

        // Filter items
        const filteredItems = category.items.filter(item => {
          // Search filter
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchesSearch =
              item.title.toLowerCase().includes(searchLower) ||
              item.description?.toLowerCase().includes(searchLower);
            if (!matchesSearch) return false;
          }

          // Status filter
          if (filters.status !== 'ALL' && item.status !== filters.status) {
            return false;
          }

          // Priority filter
          if (filters.priority !== 'ALL' && item.priority !== filters.priority) {
            return false;
          }

          return true;
        });

        if (filteredItems.length === 0) return null;

        return {
          ...category,
          items: filteredItems,
        };
      })
      .filter(Boolean) as ChecklistCategory[];
  }, [categories, filters]);

  // Calculate simple statistics - tylko to co potrzebne
  const stats = useMemo(() => {
    const total = allItems.length;
    const completed = allItems.filter(item => item.status === 'COMPLETED').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, percentage };
  }, [allItems]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'ALL') count++;
    if (filters.priority !== 'ALL') count++;
    if (filters.category !== 'ALL') count++;
    return count;
  }, [filters]);

  // Bulk actions
  const handleSelectAll = useCallback(() => {
    const allItemIds = new Set(
      filteredCategories.flatMap(cat => cat.items.map(item => item.id))
    );
    setSelectedItems(allItemIds);
  }, [filteredCategories]);

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

      {/* Filters */}
      <ChecklistFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories.map(cat => ({ id: cat.id, name: cat.name }))}
        activeFiltersCount={activeFiltersCount}
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
      <div className="space-y-3 md:space-y-4">
        {filteredCategories.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">Brak zadań spełniających kryteria filtrowania</p>
          </Card>
        ) : (
          filteredCategories.sort((a, b) => a.order - b.order).map((category, index) => {
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
          })
        )}
      </div>
    </div>
  );
}

