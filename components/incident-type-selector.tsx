'use client';

import { IncidentType } from '@/types/incident';
import {
  Flame,
  Car,
  Droplets,
  Wind,
  AlertTriangle,
  TreePine,
  Factory,
  Waves,
  Mountain,
  Wrench,
  CloudRain,
  CloudLightning,
  HelpCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface IncidentTypeSelectorProps {
  onSelect: (type: IncidentType) => void;
}

const incidentTypes: Array<{
  type: IncidentType;
  label: string;
  icon: React.ReactNode;
  color: string;
}> = [
  {
    type: 'FIRE_BUILDING',
    label: 'Pożar budynku',
    icon: <Flame className="w-8 h-8" />,
    color: 'bg-red-500 hover:bg-red-600',
  },
  {
    type: 'FIRE_FOREST',
    label: 'Pożar lasu',
    icon: <TreePine className="w-8 h-8" />,
    color: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    type: 'FIRE_VEHICLE',
    label: 'Pożar pojazdu',
    icon: <Car className="w-8 h-8" />,
    color: 'bg-red-600 hover:bg-red-700',
  },
  {
    type: 'FIRE_OUTDOOR',
    label: 'Pożar otwarty',
    icon: <Flame className="w-8 h-8" />,
    color: 'bg-orange-600 hover:bg-orange-700',
  },
  {
    type: 'ACCIDENT_ROAD',
    label: 'Wypadek drogowy',
    icon: <Car className="w-8 h-8" />,
    color: 'bg-yellow-500 hover:bg-yellow-600',
  },
  {
    type: 'ACCIDENT_INDUSTRIAL',
    label: 'Wypadek przemysłowy',
    icon: <Factory className="w-8 h-8" />,
    color: 'bg-yellow-600 hover:bg-yellow-700',
  },
  {
    type: 'HAZMAT_CHEMICAL',
    label: 'Zagrożenie chemiczne',
    icon: <AlertTriangle className="w-8 h-8" />,
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    type: 'HAZMAT_ECOLOGICAL',
    label: 'Zagrożenie ekologiczne',
    icon: <Droplets className="w-8 h-8" />,
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    type: 'RESCUE_WATER',
    label: 'Ratownictwo wodne',
    icon: <Waves className="w-8 h-8" />,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    type: 'RESCUE_HEIGHT',
    label: 'Ratownictwo wysokościowe',
    icon: <Mountain className="w-8 h-8" />,
    color: 'bg-indigo-500 hover:bg-indigo-600',
  },
  {
    type: 'RESCUE_TECHNICAL',
    label: 'Ratownictwo techniczne',
    icon: <Wrench className="w-8 h-8" />,
    color: 'bg-gray-500 hover:bg-gray-600',
  },
  {
    type: 'FLOOD',
    label: 'Powódź',
    icon: <CloudRain className="w-8 h-8" />,
    color: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    type: 'STORM',
    label: 'Burza/Wichura',
    icon: <CloudLightning className="w-8 h-8" />,
    color: 'bg-slate-500 hover:bg-slate-600',
  },
  {
    type: 'OTHER',
    label: 'Inne',
    icon: <HelpCircle className="w-8 h-8" />,
    color: 'bg-gray-400 hover:bg-gray-500',
  },
];

export default function IncidentTypeSelector({ onSelect }: IncidentTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {incidentTypes.map(({ type, label, icon, color }, index) => (
        <Card
          key={type}
          onClick={() => onSelect(type)}
          className={cn(
            "group relative overflow-hidden cursor-pointer transition-all duration-300",
            "hover:scale-105 hover:shadow-2xl active:scale-95",
            "border-2 border-transparent hover:border-white/50",
            color,
            "animate-fade-in"
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content */}
          <div className="relative p-6 flex flex-col items-center justify-center gap-3 min-h-[140px]">
            <div className="relative">
              <div className="transition-transform duration-300 group-hover:scale-110">
                {icon}
              </div>
              <div className="absolute inset-0 bg-white/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-sm font-bold text-center text-white drop-shadow-lg">
              {label}
            </span>
          </div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </Card>
      ))}
    </div>
  );
}

