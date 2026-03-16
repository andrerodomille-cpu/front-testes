import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, Copy, Eye } from 'lucide-react';

export interface Action {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

interface ActionMenuProps {
  actions: Action[];
  disabled?: boolean;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ actions, disabled = false }) => {
  const [open, setOpen] = useState(false);

  const handleAction = (action: Action) => {
    // Fecha o menu antes de executar a ação
    setOpen(false);
    // Pequeno delay para garantir que o menu fechou
    setTimeout(() => {
      action.onClick();
    }, 100);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0"
          disabled={disabled}
        >
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => handleAction(action)}
            disabled={action.disabled}
            className={action.variant === 'destructive' ? 'text-red-600 focus:text-red-600 focus:bg-red-50' : ''}
          >
            {action.icon && <span className="mr-2 h-4 w-4">{action.icon}</span>}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionMenu;