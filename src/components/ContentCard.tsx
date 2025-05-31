
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ContentCardProps {
  title: string;
  description?: string;
  metadata?: string;
  type?: 'prompt' | 'idea' | 'product';
  link?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  title, 
  description, 
  metadata, 
  type = 'prompt',
  link 
}) => {
  const handleClick = () => {
    if (link && type === 'product') {
      window.open(link, '_blank');
    }
  };

  return (
    <Card 
      className={`h-full transition-all duration-200 hover:shadow-md ${
        link && type === 'product' ? 'cursor-pointer hover:shadow-lg' : ''
      }`}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold leading-tight">{title}</CardTitle>
          {metadata && (
            <Badge variant="secondary" className="text-xs">
              {metadata}
            </Badge>
          )}
        </div>
      </CardHeader>
      {description && (
        <CardContent className="pt-0">
          <CardDescription className="text-sm text-gray-600 leading-relaxed">
            {description}
          </CardDescription>
          {link && type === 'product' && (
            <div className="mt-3">
              <Badge variant="outline" className="text-xs">
                Click to access
              </Badge>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default ContentCard;
