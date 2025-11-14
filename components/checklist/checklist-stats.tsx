'use client';

import { CheckCircle2, Clock, AlertCircle, XCircle, Circle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export interface ChecklistStatistics {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  skipped: number;
  percentage: number;
  estimatedTimeTotal: number;
  estimatedTimeRemaining: number;
}

interface ChecklistStatsProps {
  stats: ChecklistStatistics;
  compact?: boolean;
}

export default function ChecklistStats({ stats, compact = false }: ChecklistStatsProps) {
  if (compact) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-gray-900">Postęp</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.percentage}%</span>
          </div>
          <Progress value={stats.percentage} className="h-2 mb-2" />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{stats.completed} / {stats.total} zadań</span>
            {stats.estimatedTimeRemaining > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                ~{stats.estimatedTimeRemaining} min
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {/* Total */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Circle className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Wszystkie</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completed */}
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-green-600 font-medium">Zakończone</p>
              <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* In Progress */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">W trakcie</p>
              <p className="text-2xl font-bold text-blue-700">{stats.inProgress}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Oczekujące</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skipped */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <XCircle className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Pominięte</p>
              <p className="text-2xl font-bold text-gray-900">{stats.skipped}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar - Full Width */}
      <Card className="col-span-2 md:col-span-5 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Ogólny postęp</span>
            <span className="text-lg font-bold text-gray-900">{stats.percentage}%</span>
          </div>
          <Progress value={stats.percentage} className="h-3" />
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>{stats.completed} z {stats.total} zadań zakończonych</span>
            {stats.estimatedTimeRemaining > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Pozostało ~{stats.estimatedTimeRemaining} min
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

