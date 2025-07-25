
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellidos</TableHead>
              <TableHead>Cargo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.firstName}</TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
      <div className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </div>
        <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
        >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Anterior</span>
        </Button>
        <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
        >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Siguiente</span>
        </Button>
      </div>
    </div>
  );
}

    