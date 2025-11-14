'use client';

import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChecklistItemStatus, Priority } from '@/types/incident';

export interface ChecklistFilters {
  search: string;
  status: ChecklistItemStatus | 'ALL';
  priority: Priority | 'ALL';
  category: string | 'ALL';
}

interface ChecklistFiltersProps {
  filters: ChecklistFilters;
  onFiltersChange: (filters: ChecklistFilters) => void;
  categories: Array<{ id: string; name: string }>;
  activeFiltersCount: number;
}

const STATUS_LABELS: Record<ChecklistItemStatus | 'ALL', string> = {
  ALL: 'Wszystkie',
  PENDING: 'Oczekujące',
  IN_PROGRESS: 'W trakcie',
  COMPLETED: 'Zakończone',
  SKIPPED: 'Pominięte',
  NOT_APPLICABLE: 'Nie dotyczy',
};

const PRIORITY_LABELS: Record<Priority | 'ALL', string> = {
  ALL: 'Wszystkie',
  LOW: 'Niski',
  MEDIUM: 'Średni',
  HIGH: 'Wysoki',
  CRITICAL: 'Krytyczny',
};

export default function ChecklistFiltersComponent({
  filters,
  onFiltersChange,
  categories,
  activeFiltersCount,
}: ChecklistFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value as ChecklistItemStatus | 'ALL' });
  };

  const handlePriorityChange = (value: string) => {
    onFiltersChange({ ...filters, priority: value as Priority | 'ALL' });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({ ...filters, category: value });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'ALL',
      priority: 'ALL',
      category: 'ALL',
    });
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Szukaj zadań..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {filters.search && (
          <button
            onClick={() => handleSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filtry:</span>
        </div>

        {/* Status Filter */}
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={filters.priority} onValueChange={handlePriorityChange}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={filters.category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Wszystkie kategorie</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Active Filters Badge */}
        {activeFiltersCount > 0 && (
          <>
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount} {activeFiltersCount === 1 ? 'filtr' : 'filtry'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-9 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Wyczyść
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

