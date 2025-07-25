
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { inventory, employees } from '@/lib/data';
import {
  ArrowRight,
  User,
  Wrench,
  Boxes,
  ClipboardPlus,
  PlusCircle,
} from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const totalItems = inventory.length;
  const assignedItems = inventory.filter(
    (item) => item.status === 'Asignado'
  ).length;
  const availableItems = inventory.filter(
    (item) => item.status === 'Disponible'
  ).length;
  const maintenanceItems = inventory.filter(
    (item) => item.status === 'En Mantenimiento'
  ).length;
  const totalEmployees = employees.length;

  const statusData = [
    { name: 'Disponibles', value: availableItems, fill: 'hsl(var(--chart-2))' },
    { name: 'Asignados', value: assignedItems, fill: 'hsl(var(--chart-3))' },
    { name: 'En Mant.', value: maintenanceItems, fill: 'hsl(var(--chart-5))' },
  ];

  const typeData = [
    { name: 'Herramientas', value: inventory.filter(i => i.type === 'Herramienta').length, fill: 'hsl(var(--chart-1))' },
    { name: 'Materiales', value: inventory.filter(i => i.type === 'Material').length, fill: 'hsl(var(--chart-2))'},
    { name: 'EPP', value: inventory.filter(i => i.type === 'EPP').length, fill: 'hsl(var(--chart-4))'},
  ];

  const COLORS = typeData.map(d => d.fill);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Una vista general interactiva de tu inventario y asignaciones."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artículos Totales</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Tipos de artículos únicos en inventario.
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
            <p className="text-xs text-muted-foreground">activos en el sistema.</p>
          </CardContent>
        </Card>
         <Card className="lg:col-span-2 bg-gradient-to-br from-primary/10 to-background">
          <CardHeader>
            <CardTitle>Detección de Discrepancias con IA</CardTitle>
            <CardDescription>
              Usa nuestra IA para identificar discrepancias en tu inventario automáticamente.
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
      <div className="mt-6 grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Estado del Inventario</CardTitle>
            <CardDescription>
              Un resumen de los artículos por su estado actual.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-48 w-full">
              <BarChart accessibilityLayer data={statusData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  width={80}
                  className="text-sm"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="value" radius={5} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Distribución por Tipo</CardTitle>
            <CardDescription>
              Desglose de artículos por categoría.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
             <ChartContainer config={{}} className="h-48 w-full max-w-[250px]">
                <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                    <Pie data={typeData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={70} strokeWidth={2}>
                        {typeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                </PieChart>
             </ChartContainer>
          </CardContent>
        </Card>
      </div>
       <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>Atajos a tareas comunes.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
                 <Button variant="outline" asChild>
                    <Link href="/inventory">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir Artículo
                    </Link>
                 </Button>
                 <Button variant="outline" asChild>
                    <Link href="/assignments">
                       <ClipboardPlus className="mr-2 h-4 w-4" />
                       Crear Asignación
                    </Link>
                </Button>
            </CardContent>
        </Card>
         <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Mantenimiento</CardTitle>
                <CardDescription>Resumen de herramientas que requieren atención.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
                <div className="flex items-center justify-center rounded-full bg-primary/10 size-20">
                    <Wrench className="h-10 w-10 text-primary" />
                </div>
                <div>
                    <p className="text-4xl font-bold">{maintenanceItems}</p>
                    <p className="text-muted-foreground">herramientas en mantenimiento.</p>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild variant="secondary" size="sm">
                    <Link href="/inventory">Ver Inventario</Link>
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
