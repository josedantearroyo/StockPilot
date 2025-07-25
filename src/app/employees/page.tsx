
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { employees } from '@/lib/data';
import { EmployeesTable } from './employees-table';
import { Card, CardContent } from '@/components/ui/card';
import { AddEmployeeDialog } from './add-employee-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

export default function EmployeesPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(employees.length / ITEMS_PER_PAGE);
  const paginatedEmployees = employees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <PageHeader
        title="Empleados"
        description="Ver y gestionar los empleados de la empresa."
      >
        <AddEmployeeDialog>
          <Button size="sm" className="ml-auto gap-1">
            <PlusCircle className="h-4 w-4" />
            Añadir Empleado
          </Button>
        </AddEmployeeDialog>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
          <EmployeesTable
            data={paginatedEmployees}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
