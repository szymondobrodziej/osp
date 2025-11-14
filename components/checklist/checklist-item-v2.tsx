'use client';

import { useState } from 'react';
import { ChecklistItem as ChecklistItemType } from '@/types/incident';
import { useIncidentStore } from '@/store/incident-store';
import {
  Check,
  Circle,
  Clock,
  Loader2,
  Play,
  CheckCircle2,
  XCircle,
  Square,
  CheckSquare,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import SkipDialog from './skip-dialog';

interface ChecklistItemProps {
  item: ChecklistItemType;
  categoryId: string;
  compact?: boolean;
  selected?: boolean;
  onToggleSelect?: (itemId: string) => void;
}

export default function ChecklistItemV2({
  item,
  categoryId,
  compact = false,
  selected = false,
  onToggleSelect,
}: ChecklistItemProps) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState(item.notes || '');
  const [showSkipDialog, setShowSkipDialog] = useState(false);

  const { updateChecklistItem, completeChecklistItem, skipChecklistItem } = useIncidentStore();

  const handleComplete = () => {
    if (showNoteInput) {
      completeChecklistItem(categoryId, item.id, note);
      setShowNoteInput(false);
    } else {
      setShowNoteInput(true);
    }
  };

  const handleSkip = (reason: string) => {
    skipChecklistItem(categoryId, item.id, reason);
  };

  const handleStart = () => {
    updateChecklistItem(categoryId, item.id, { status: 'IN_PROGRESS' });
  };

  const getStatusIcon = () => {
    switch (item.status) {
      case 'COMPLETED':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'IN_PROGRESS':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'SKIPPED':
        return <XCircle className="w-5 h-5 text-gray-400" />;
      case 'NOT_APPLICABLE':
        return <Circle className="w-5 h-5 text-gray-300" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = () => {
    switch (item.priority) {
      case 'CRITICAL':
        return 'border-l-red-500 bg-gradient-to-r from-red-50 to-transparent';
      case 'HIGH':
        return 'border-l-orange-500 bg-gradient-to-r from-orange-50 to-transparent';
      case 'MEDIUM':
        return 'border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-transparent';
      default:
        return 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-transparent';
    }
  };

  const getPriorityBadge = () => {
    switch (item.priority) {
      case 'CRITICAL':
        return <Badge variant="destructive" className="text-xs">Krytyczne</Badge>;
      case 'HIGH':
        return <Badge className="text-xs bg-orange-500">Wysokie</Badge>;
      case 'MEDIUM':
        return <Badge className="text-xs bg-yellow-500">Średnie</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Niskie</Badge>;
    }
  };

  const isCompleted = item.status === 'COMPLETED';
  const isSkipped = item.status === 'SKIPPED';
  const isInProgress = item.status === 'IN_PROGRESS';

  // Ultra kompaktowy widok - jedna linia
  if (compact) {
    return (
      <>
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-2 border-l-4 rounded-r transition-all duration-150',
            'hover:bg-gray-50 cursor-pointer group',
            getPriorityColor(),
            isCompleted && 'opacity-60',
            isSkipped && 'opacity-40',
            selected && 'ring-2 ring-blue-500 bg-blue-50'
          )}
          onClick={() => onToggleSelect?.(item.id)}
        >
          {/* Checkbox - tylko gdy selection enabled */}
          {onToggleSelect && (
            <Checkbox
              checked={selected}
              onCheckedChange={() => onToggleSelect(item.id)}
              onClick={(e) => e.stopPropagation()}
              className="flex-shrink-0"
            />
          )}

          {/* Status Icon - mniejszy */}
          <div className="flex-shrink-0">{getStatusIcon()}</div>

          {/* Title - truncate */}
          <div className="flex-1 min-w-0">
            <span
              className={cn(
                'text-sm font-medium',
                isCompleted && 'line-through text-gray-500',
                isSkipped && 'line-through text-gray-400'
              )}
            >
              {item.title}
            </span>
          </div>

          {/* Priority emoji - tylko dla HIGH i CRITICAL */}
          {item.priority === 'CRITICAL' && <span className="text-sm">🚨</span>}
          {item.priority === 'HIGH' && <span className="text-sm">⚠️</span>}

          {/* Duration - kompaktowy */}
          {item.estimatedDuration && (
            <span className="text-xs text-gray-500 flex-shrink-0">
              {item.estimatedDuration}m
            </span>
          )}

          {/* Actions - pokazują się na hover lub gdy in progress */}
          <div
            className={cn(
              'flex gap-1 flex-shrink-0 transition-opacity',
              !isInProgress && 'opacity-0 group-hover:opacity-100'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {!isCompleted && !isSkipped && (
              <>
                {!isInProgress ? (
                  <Button
                    onClick={handleStart}
                    size="sm"
                    className="h-7 w-7 p-0 bg-blue-500 hover:bg-blue-600"
                    title="Rozpocznij"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleComplete}
                    size="sm"
                    className="h-7 w-7 p-0 bg-green-500 hover:bg-green-600"
                    title="Zakończ"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                )}
                <Button
                  onClick={() => setShowSkipDialog(true)}
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:bg-gray-200"
                  title="Pomiń"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
          </div>
        </div>

        <SkipDialog
          open={showSkipDialog}
          onOpenChange={setShowSkipDialog}
          onConfirm={handleSkip}
          itemTitle={item.title}
        />
      </>
    );
  }

  // Normal view (existing code with selection checkbox)
  return (
    <>
      <Card
        className={cn(
          'border-l-4 mb-2 md:mb-3 transition-all duration-300 hover:shadow-md',
          getPriorityColor(),
          isCompleted && 'opacity-70',
          isSkipped && 'opacity-50',
          selected && 'ring-2 ring-blue-500'
        )}
      >
        <CardContent className="p-2.5 md:p-4">
          <div className="flex items-start gap-2 md:gap-3">
            {/* Checkbox */}
            {onToggleSelect && (
              <div className="mt-1">
                <Checkbox checked={selected} onCheckedChange={() => onToggleSelect(item.id)} />
              </div>
            )}

            <div className="flex-1 space-y-2 md:space-y-3">
              <div className="flex items-start justify-between gap-2 md:gap-3">
                <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                  <div className="mt-0.5 md:mt-1 flex-shrink-0">{getStatusIcon()}</div>
                  <div className="flex-1 space-y-1.5 md:space-y-2 min-w-0">
                    <div className="flex items-start gap-1.5 md:gap-2 flex-wrap">
                      <h4
                        className={cn(
                          'font-semibold text-xs md:text-sm',
                          isCompleted && 'line-through text-gray-500'
                        )}
                      >
                        {item.title}
                      </h4>
                      {getPriorityBadge()}
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 text-xs text-gray-500">
                      {item.estimatedDuration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>~{item.estimatedDuration} min</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 md:gap-2 flex-shrink-0">
                  {!isCompleted && !isSkipped && (
                    <>
                      {!isInProgress && (
                        <Button
                          onClick={handleStart}
                          size="sm"
                          className="h-7 md:h-8 bg-blue-500 hover:bg-blue-600 text-xs md:text-sm px-2 md:px-3"
                        >
                          <Play className="w-3 h-3 md:mr-1" />
                          <span className="hidden sm:inline">Start</span>
                        </Button>
                      )}
                      {isInProgress && (
                        <Button
                          onClick={handleComplete}
                          size="sm"
                          className="h-7 md:h-8 bg-green-500 hover:bg-green-600 text-xs md:text-sm px-2 md:px-3"
                        >
                          <CheckCircle2 className="w-3 h-3 md:mr-1" />
                          <span className="hidden sm:inline">Zakończ</span>
                        </Button>
                      )}
                      <Button
                        onClick={() => setShowSkipDialog(true)}
                        size="sm"
                        variant="outline"
                        className="h-7 md:h-8 text-xs md:text-sm px-2 md:px-3"
                      >
                        <XCircle className="w-3 h-3 md:mr-1" />
                        <span className="hidden sm:inline">Pomiń</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 md:space-y-3 pt-2 md:pt-3 border-t">
                {item.description && (
                  <Card className="bg-gray-50/50 border-gray-200">
                    <CardContent className="p-2 md:p-3">
                      <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                )}

                {item.completedAt && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span>Zakończono: {formatDistanceToNow(item.completedAt, { addSuffix: true, locale: pl })}</span>
                  </div>
                )}

                {item.notes && (
                  <Card className="bg-blue-50/50 border-blue-200">
                    <CardContent className="p-2 md:p-3">
                      <p className="text-xs font-semibold text-blue-900 mb-1">📝 Notatki:</p>
                      <p className="text-xs md:text-sm text-blue-800">{item.notes}</p>
                    </CardContent>
                  </Card>
                )}

                {showNoteInput && (
                  <div className="space-y-2 animate-slide-up">
                    <Textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Dodaj notatkę (opcjonalnie)..."
                      className="min-h-[60px] md:min-h-[80px] text-sm"
                    />
                    <div className="flex gap-1.5 md:gap-2">
                      <Button onClick={handleComplete} size="sm" className="bg-green-500 hover:bg-green-600 h-8 text-xs md:text-sm">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Potwierdź
                      </Button>
                      <Button onClick={() => setShowNoteInput(false)} size="sm" variant="outline" className="h-8 text-xs md:text-sm">
                        Anuluj
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <SkipDialog
        open={showSkipDialog}
        onOpenChange={setShowSkipDialog}
        onConfirm={handleSkip}
        itemTitle={item.title}
      />
    </>
  );
}

