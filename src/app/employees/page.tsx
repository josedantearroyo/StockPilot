import { PageHeader } from '@/components/page-header';
import { employees } from '@/lib/data';
import { EmployeesTable } from './employees-table';
import { Card, CardContent } from '@/components/ui/card';
import { AddEmployeeDialog } from './add-employee-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function EmployeesPage() {
  return (
    <div>
      <PageHeader
        title="Employees"
        description="View and manage company employees."
      >
        <AddEmployeeDialog>
          <Button size="sm" className="ml-auto gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Employee
          </Button>
        </AddEmployeeDialog>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
          <EmployeesTable data={employees} />
        </CardContent>
      </Card>
    </div>
  );
}