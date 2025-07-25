
'use client';

import type { Item } from '@/lib/types';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { employees } from '@/lib/data';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface InventoryTableProps {
  data: Item[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function InventoryTable({ data, currentPage, totalPages, onPageChange }: InventoryTableProps) {
  const getEmployeeName = (employeeId?: string) => {
    if (!employeeId) return '-';
    const employee = employees.find((e) => e.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  };

  const getStatusVariant = (status: Item['status']) => {
    switch (status) {
      case 'Disponible':
        return 'default';
      case 'Asignado':
        return 'secondary';
      case 'En Mantenimiento':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  const getTypeVariant = (type: Item['type']) => {
    switch (type) {
      case 'Herramienta':
        return 'outline';
      case 'Material':
        return 'outline';
      case 'EPP':
        return 'outline';
      default:
        return 'outline';
    }
  }


  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Quantity</TableHead>
              <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeVariant(item.type)}>{item.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(item.status)}>
                        {item.status}
                        </Badge>
                        {item.status === 'En Mantenimiento' && (
                            <Badge variant="secondary" className="px-1.5">{item.quantity}</Badge>
                        )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{item.quantity}</TableCell>
                  <TableCell className="hidden lg:table-cell">{getEmployeeName(item.assignedTo)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
        >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
        </Button>
        <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
        >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  );
}
