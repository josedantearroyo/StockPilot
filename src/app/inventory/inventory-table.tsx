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
import { employees } from '@/lib/data';

interface InventoryTableProps {
  data: Item[];
}

export function InventoryTable({ data }: InventoryTableProps) {
  const getEmployeeName = (employeeId?: string) => {
    if (!employeeId) return '-';
    return employees.find((e) => e.id === employeeId)?.name || 'Unknown';
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
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
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
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>{getEmployeeName(item.assignedTo)}</TableCell>
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
    </div>
  );
}
