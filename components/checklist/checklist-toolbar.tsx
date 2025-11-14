'use client';

import { LayoutGrid, List, CheckSquare, Square, Download, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChecklistToolbarProps {
  viewMode: 'normal' | 'compact';
  onViewModeChange: (mode: 'normal' | 'compact') => void;
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkComplete: () => void;
  onExport?: () => void;
  onShowKeyboardShortcuts?: () => void;
}

export default function ChecklistToolbar({
  viewMode,
  onViewModeChange,
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkComplete,
  onExport,
  onShowKeyboardShortcuts,
}: ChecklistToolbarProps) {
  const hasSelection = selectedCount > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-gray-200 rounded-lg">
      {/* Left Side - Bulk Actions */}
      <div className="flex items-center gap-2">
        {hasSelection ? (
          <>
            <Badge variant="secondary" className="px-3 py-1">
              {selectedCount} zaznaczonych
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={onDeselectAll}
              className="h-8"
            >
              <Square className="w-4 h-4 mr-1" />
              Odznacz
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onBulkComplete}
              className="h-8 bg-green-500 hover:bg-green-600"
            >
              <CheckSquare className="w-4 h-4 mr-1" />
              Zakończ zaznaczone
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            className="h-8"
          >
            <CheckSquare className="w-4 h-4 mr-1" />
            Zaznacz wszystkie
          </Button>
        )}
      </div>

      {/* Right Side - View Options */}
      <div className="flex items-center gap-2">
        {/* View Mode Toggle */}
        <TooltipProvider>
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'normal' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('normal')}
                  className="h-7 px-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Widok normalny</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'compact' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('compact')}
                  className="h-7 px-2"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Widok kompaktowy</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Export Button */}
          {onExport && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExport}
                  className="h-8"
                >
                  <Download className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Eksport</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Eksportuj checklistę</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Keyboard Shortcuts */}
          {onShowKeyboardShortcuts && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShowKeyboardShortcuts}
                  className="h-8"
                >
                  <Keyboard className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Skróty klawiszowe</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>
    </div>
  );
}

