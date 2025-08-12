
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
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Desconocido';
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
  
  const getTypeVariant = (type: Item['type']): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'Herramienta':
        return 'outline';
      case 'Material':
        return 'secondary';
      case 'EPP':
        return 'default';
      default:
        return 'outline';
    }
  }


  return (
    <div className="w-full">
      <div className="rounded-md border border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              <TableHead className="font-semibold text-foreground">Nombre</TableHead>
              <TableHead className="font-semibold text-foreground">Tipo</TableHead>
              <TableHead className="font-semibold text-foreground">Estado</TableHead>
              <TableHead className="hidden md:table-cell font-semibold text-foreground">Cantidad</TableHead>
              <TableHead className="hidden lg:table-cell font-semibold text-foreground">Asignado a</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors duration-150">
                  <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeVariant(item.type)} className="hover:bg-primary/10 transition-colors duration-150">{item.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(item.status)} className="transition-colors duration-150">
                        {item.status}
                        </Badge>
                        {item.status === 'En Mantenimiento' && (
                            <Badge variant="secondary" className="px-1.5 transition-colors duration-150">{item.quantity}</Badge>
                        )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-foreground">{item.quantity}</TableCell>
                  <TableCell className="hidden lg:table-cell text-foreground">{getEmployeeName(item.assignedTo)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between p-4 border-t border-border/50">
        <div className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="hover:bg-accent/50 transition-colors duration-200"
          >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Anterior</span>
          </Button>
          <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="hover:bg-accent/50 transition-colors duration-200"
          >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Siguiente</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

    