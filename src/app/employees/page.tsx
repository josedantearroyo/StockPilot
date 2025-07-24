import { PageHeader } from '@/components/page-header';
import { employees } from '@/lib/data';
import { EmployeesTable } from './employees-table';
import { Card, CardContent } from '@/components/ui/card';

export default function EmployeesPage() {
  return (
    <div>
      <PageHeader
        title="Employees"
        description="View and manage company employees."
      />
      <Card>
        <CardContent className="pt-6">
          <EmployeesTable data={employees} />
        </CardContent>
      </Card>
    </div>
  );
}
