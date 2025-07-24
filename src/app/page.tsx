import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { inventory, employees } from '@/lib/data';
import {
  Boxes,
  ArrowRight,
  UserCheck,
  Building,
  Wrench,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';

export default function Dashboard() {
  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const assignedItems = inventory.filter(
    (item) => item.status === 'Asignado'
  ).length;
  const availableItems = inventory.length - assignedItems;
  const totalEmployees = employees.length;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="An overview of your inventory and assignments."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              in {inventory.length} unique item types
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Items</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedItems}</div>
            <p className="text-xs text-muted-foreground">
              currently checked out
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Items
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableItems}</div>
            <p className="text-xs text-muted-foreground">
              in warehouse
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">active in system</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 grid gap-4 grid-cols-1">
        <Card className="bg-gradient-to-br from-primary/10 to-background">
          <CardHeader>
            <CardTitle>AI-Powered Discrepancy Detection</CardTitle>
            <CardDescription>
              Use our intelligent tool to automatically identify discrepancies in your inventory based on assignment records and current stock levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/reports/discrepancy"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Generate Report <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
