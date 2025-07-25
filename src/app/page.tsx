
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
  const maintenanceTools = inventory.filter(
    (item) => item.type === 'Herramienta' && item.status === 'En Mantenimiento'
  ).length;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Una vista general de tu inventario y asignaciones."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artículos Totales</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              en {inventory.length} tipos de artículos únicos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artículos Asignados</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedItems}</div>
            <p className="text-xs text-muted-foreground">
              actualmente en uso
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Artículos Disponibles
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableItems}</div>
            <p className="text-xs text-muted-foreground">
              en almacén
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empleados</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">activos en el sistema</p>
          </CardContent>
        </Card>
      </div>
       <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                Herramientas en Mantenimiento
                </CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{maintenanceTools}</div>
                <p className="text-xs text-muted-foreground">
                herramientas que necesitan reparación
                </p>
            </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3 bg-gradient-to-br from-primary/10 to-background">
          <CardHeader>
            <CardTitle>Detección de Discrepancias con IA</CardTitle>
            <CardDescription>
              Usa nuestra herramienta inteligente para identificar discrepancias en tu inventario automáticamente, basándose en los registros de asignación y el stock actual.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/reports/discrepancy"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Generar Reporte <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    