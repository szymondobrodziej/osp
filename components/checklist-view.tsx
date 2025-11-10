'use client';

import { useState } from 'react';
import { ChecklistCategory, ChecklistItem as ChecklistItemType } from '@/types/incident';
import { useIncidentStore } from '@/store/incident-store';
import {
  Check,
  Circle,
  Clock,
  AlertCircle,
  X,
  Loader2,
  Play,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChecklistViewProps {
  categories: ChecklistCategory[];
}

function ChecklistItem({
  item,
  categoryId
}: {
  item: ChecklistItemType;
  categoryId: string;
}) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState(item.notes || '');
  
  const { updateChecklistItem, completeChecklistItem, skipChecklistItem } = useIncidentStore();
  
  const handleComplete = () => {
    if (showNoteInput) {
      completeChecklistItem(categoryId, item.id, note);
      setShowNoteInput(false);
    } else {
      setShowNoteInput(true);
    }
  };
  
  const handleSkip = () => {
    const reason = prompt('Podaj powód pominięcia tego kroku:');
    if (reason) {
      skipChecklistItem(categoryId, item.id, reason);
    }
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
        return <X className="w-5 h-5 text-gray-400" />;
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

  return (
    <Card className={cn(
      "border-l-4 mb-2 md:mb-3 transition-all duration-300 hover:shadow-md",
      getPriorityColor(),
      isCompleted && "opacity-70",
      isSkipped && "opacity-50"
    )}>
      <CardContent className="p-2.5 md:p-4">
        <div className="flex items-start gap-2 md:gap-3">
          <div className="flex-1 space-y-2 md:space-y-3">
            <div className="flex items-start justify-between gap-2 md:gap-3">
              <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                <div className="mt-0.5 md:mt-1 flex-shrink-0">
                  {getStatusIcon()}
                </div>
                <div className="flex-1 space-y-1.5 md:space-y-2 min-w-0">
                  <div className="flex items-start gap-1.5 md:gap-2 flex-wrap">
                    <h4 className={cn(
                      "font-semibold text-xs md:text-sm",
                      isCompleted && "line-through text-gray-500"
                    )}>
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
                      onClick={handleSkip}
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

            {/* Szczegóły - zawsze widoczne */}
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
                    <Button
                      onClick={handleComplete}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 h-8 text-xs md:text-sm"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Potwierdź
                    </Button>
                    <Button
                      onClick={() => setShowNoteInput(false)}
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs md:text-sm"
                    >
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
  );
}

export default function ChecklistView({ categories }: ChecklistViewProps) {
  const getCategoryProgress = (category: ChecklistCategory) => {
    const total = category.items.length;
    const completed = category.items.filter(item => item.status === 'COMPLETED').length;
    const inProgress = category.items.filter(item => item.status === 'IN_PROGRESS').length;
    return {
      completed,
      inProgress,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {categories.sort((a, b) => a.order - b.order).map((category, index) => {
        const progress = getCategoryProgress(category);
        const isComplete = progress.percentage === 100;

        return (
          <Card
            key={category.id}
            className={cn(
              "overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in",
              isComplete && "border-green-500 bg-green-50/30"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Header - zawsze widoczny, bez możliwości zwijania */}
            <div className="w-full p-3 md:p-5 flex items-center justify-between bg-gradient-to-r from-gray-50 to-transparent border-b">
              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                {isComplete && <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />}
                <h3 className="text-base md:text-lg font-bold truncate">{category.name}</h3>
              </div>

              <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                {progress.inProgress > 0 && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs hidden md:inline-flex">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    {progress.inProgress} w trakcie
                  </Badge>
                )}
                <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="text-xs md:text-sm font-medium text-gray-600">
                    {progress.completed}/{progress.total}
                  </span>
                  <div className="w-16 md:w-32 h-2 md:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        isComplete ? "bg-green-500" : "bg-gradient-to-r from-blue-500 to-blue-600"
                      )}
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <span className={cn(
                    "text-xs md:text-sm font-bold w-8 md:w-12 text-right",
                    isComplete ? "text-green-600" : "text-gray-700"
                  )}>
                    {progress.percentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Zadania - zawsze widoczne */}
            <div className="p-2 md:p-5 bg-gradient-to-b from-gray-50/50 to-transparent">
              <div className="space-y-1.5 md:space-y-2">
                {category.items.map((item) => (
                  <ChecklistItem
                    key={item.id}
                    item={item}
                    categoryId={category.id}
                  />
                ))}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

