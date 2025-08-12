
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
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Una vista general interactiva de tu inventario y asignaciones."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Artículos Totales</CardTitle>
            <div className="rounded-full bg-primary/10 p-2">
              <Boxes className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Tipos de artículos únicos en inventario.
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Empleados</CardTitle>
            <div className="rounded-full bg-primary/10 p-2">
              <User className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">activos en el sistema.</p>
          </CardContent>
        </Card>
         <Card className="lg:col-span-2 bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20 hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-foreground">Detección de Discrepancias con IA</CardTitle>
            <CardDescription>
              Usa nuestra IA para identificar discrepancias en tu inventario automáticamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/reports/discrepancy"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors duration-200"
            >
              Generar Reporte <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-3 hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-foreground">Estado del Inventario</CardTitle>
            <CardDescription>
              Un resumen de los artículos por su estado actual.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
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
        <Card className="md:col-span-2 hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-foreground">Distribución por Tipo</CardTitle>
            <CardDescription>
              Desglose de artículos por categoría.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-6">
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
       <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="border-b border-border/50">
                <CardTitle className="text-foreground">Acciones Rápidas</CardTitle>
                <CardDescription>Atajos a tareas comunes.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-3 pt-6">
                 <Button variant="outline" asChild className="hover:bg-primary/5 transition-colors duration-200">
                    <Link href="/inventory">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir Artículo
                    </Link>
                 </Button>
                 <Button variant="outline" asChild className="hover:bg-primary/5 transition-colors duration-200">
                    <Link href="/assignments">
                       <ClipboardPlus className="mr-2 h-4 w-4" />
                       Crear Asignación
                    </Link>
                </Button>
            </CardContent>
        </Card>
         <Card className="lg:col-span-3 hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="border-b border-border/50">
                <CardTitle className="text-foreground">Mantenimiento</CardTitle>
                <CardDescription>Resumen de herramientas que requieren atención.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6 pt-6">
                <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/20 size-20">
                    <Wrench className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1">
                    <p className="text-4xl font-bold text-foreground">{maintenanceItems}</p>
                    <p className="text-muted-foreground">herramientas en mantenimiento.</p>
                </div>
            </CardContent>
            <CardFooter className="border-t border-border/50 pt-6">
                <Button asChild variant="secondary" size="sm" className="hover:bg-secondary/80 transition-colors duration-200">
                    <Link href="/inventory">Ver Inventario</Link>
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
