import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
  onClear?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Pesquisar...",
  resultCount,
  onClear
}) => {
  return (
    <div className="flex items-center space-x-2 mb-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent"
            onClick={() => {
              onChange('');
              onClear?.();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {resultCount !== undefined && value && (
        <Badge className="bg-blue-600 h-8 px-3">
          {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
        </Badge>
      )}
    </div>
  );
};

export default SearchBar;