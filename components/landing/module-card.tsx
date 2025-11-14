'use client';

import { LucideIcon, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ModuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  buttonText: string;
  iconColor?: string;
  iconBgColor?: string;
}

export default function ModuleCard({
  icon: Icon,
  title,
  description,
  href,
  buttonText,
  iconColor = 'text-red-600',
  iconBgColor = 'bg-red-50',
}: ModuleCardProps) {
  return (
    <Card className="group relative overflow-hidden border border-gray-200 hover:border-red-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/0 to-red-50/0 group-hover:from-red-50/50 group-hover:to-transparent transition-all duration-300" />
      
      <CardContent className="relative p-8 space-y-6">
        {/* Icon */}
        <div className={`inline-flex p-4 rounded-xl ${iconBgColor} transition-transform group-hover:scale-110 duration-300`}>
          <Icon className={`w-8 h-8 ${iconColor}`} strokeWidth={1.5} />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed min-h-[3rem]">
            {description}
          </p>
        </div>

        {/* Button */}
        <Link href={href} className="block">
          <Button
            variant="ghost"
            className="w-full justify-between text-red-600 hover:text-red-700 hover:bg-red-50 group/btn"
          >
            <span className="font-medium">{buttonText}</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

