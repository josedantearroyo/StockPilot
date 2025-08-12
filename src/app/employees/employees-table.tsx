
'use client';

import type { Employee } from '@/lib/types';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EmployeesTableProps {
  data: Employee[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function EmployeesTable({ data, currentPage, totalPages, onPageChange }: EmployeesTableProps) {
  return (
    <div className="w-full">
      <div className="rounded-md border border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              <TableHead className="font-semibold text-foreground">Nombre</TableHead>
              <TableHead className="font-semibold text-foreground">Apellidos</TableHead>
              <TableHead className="font-semibold text-foreground">Cargo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((employee) => (
                <TableRow key={employee.id} className="hover:bg-muted/30 transition-colors duration-150">
                  <TableCell className="font-medium text-foreground">{employee.firstName}</TableCell>
                  <TableCell className="text-foreground">{employee.lastName}</TableCell>
                  <TableCell className="text-foreground">{employee.position}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
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

    