/**
 * Role Switcher Component
 * 
 * Allows demo switching between different user personas
 * (Analyst, Auditor, Supplier) for context-aware responses
 */

import { UserRole } from '@shared/schema';
import type { UserRoleType } from '@shared/schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users } from 'lucide-react';

interface RoleSwitcherProps {
  value: UserRoleType;
  onValueChange: (value: UserRoleType) => void;
}

export function RoleSwitcher({ value, onValueChange }: RoleSwitcherProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-48" data-testid="select-user-role">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={UserRole.ANALYST} data-testid="option-role-analyst">
          ESG Analyst
        </SelectItem>
        <SelectItem value={UserRole.AUDITOR} data-testid="option-role-auditor">
          Auditor
        </SelectItem>
        <SelectItem value={UserRole.SUPPLIER} data-testid="option-role-supplier">
          Supplier
        </SelectItem>
        <SelectItem value={UserRole.MANAGER} data-testid="option-role-manager">
          Sustainability Manager
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
