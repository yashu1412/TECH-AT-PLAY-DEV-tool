import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './card';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient?: string;
  className?: string;
  onClick?: () => void;
}

export function ToolCard({ 
  title, 
  description, 
  icon: Icon, 
  gradient = "gradient-primary",
  className,
  onClick 
}: ToolCardProps) {
  return (
    <Card 
      className={cn(
        "glass-effect hover-scale hover-glow cursor-pointer group transition-all duration-300",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className={cn("p-3 rounded-xl mb-4 inline-block", gradient)}>
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}