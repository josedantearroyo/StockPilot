
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { employees, inventory } from '@/lib/data';
import type { Employee, Item } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function AssignmentsPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedTools, setSelectedTools] = useState<Record<string, boolean>>({});
  const [selectedEpps, setSelectedEpps] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const availableTools = inventory.filter(
    (item) => item.type === 'Herramienta' && item.status === 'Disponible'
  );
  
  const availableEpps = inventory.filter(
    (item) => item.type === 'EPP' && item.status === 'Disponible'
  );

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId) || null;
    setSelectedEmployee(employee);
    setSelectedTools({});
    setSelectedEpps({});
  };

  const handleToolSelection = (toolId: string) => {
    setSelectedTools((prev) => ({
      ...prev,
      [toolId]: !prev[toolId],
    }));
  };
  
  const handleEppSelection = (eppId: string) => {
    setSelectedEpps((prev) => ({
      ...prev,
      [eppId]: !prev[eppId],
    }));
  };

  const handleAssign = (type: 'tool' | 'epp') => {
    if (!selectedEmployee) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Por favor, seleccione un empleado.',
      });
      return;
    }

    const itemsToAssign =
      type === 'tool'
        ? Object.keys(selectedTools).filter((id) => selectedTools[id])
        : Object.keys(selectedEpps).filter((id) => selectedEpps[id]);

    const itemType = type === 'tool' ? 'herramienta(s)' : 'EPP(s)';
    
    if (itemsToAssign.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Por favor, seleccione al menos un(a) ${itemType}.`,
      });
      return;
    }

    // This is where you would typically update your backend/database
    console.log(
      `Asignando ${itemsToAssign.join(', ')} a ${selectedEmployee.name}`
    );

    toast({
      title: 'Asignación Exitosa',
      description: `${itemsToAssign.length} ${itemType} asignada(s) a ${selectedEmployee.name}.`,
    });

    // Reset selection
    if (type === 'tool') {
      setSelectedTools({});
    } else {
      setSelectedEpps({});
    }
  };
  
  const getAssignedItems = (employeeId: string): Item[] => {
    return inventory.filter(item => item.assignedTo === employeeId);
  }
  
  const handleReturnAll = (employee: Employee) => {
    const assigned = getAssignedItems(employee.id);
    // This is where you would typically update your backend/database
    console.log(`Todos los artículos devueltos por ${employee.name}`);
    toast({
      title: 'Devolución Exitosa',
      description: `Se han devuelto ${assigned.length} artículos de ${employee.name}.`,
    });
  }

  return (
    <div>
      <PageHeader
        title="Gestión de Asignaciones"
        description="Asigne herramientas y EPP a los empleados para el trabajo diario."
      />
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Crear Nueva Asignación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="employee-select">Seleccionar Empleado</Label>
              <Select onValueChange={handleEmployeeChange}>
                <SelectTrigger id="employee-select">
                  <SelectValue placeholder="Seleccione un empleado" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedEmployee && (
              <Tabs defaultValue="tools">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="tools">Herramientas</TabsTrigger>
                  <TabsTrigger value="epp">EPP</TabsTrigger>
                </TabsList>
                <TabsContent value="tools">
                  <div className="space-y-4 pt-4">
                      <h3 className="text-lg font-medium">Herramientas Disponibles</h3>
                      <div className="space-y-2 rounded-md border p-4 max-h-60 overflow-y-auto">
                      {availableTools.length > 0 ? (
                        availableTools.map((tool) => (
                          <div key={tool.id} className="flex items-center gap-2">
                            <Checkbox
                              id={`tool-${tool.id}`}
                              checked={!!selectedTools[tool.id]}
                              onCheckedChange={() => handleToolSelection(tool.id)}
                            />
                            <Label htmlFor={`tool-${tool.id}`} className="font-normal">
                              {tool.name}
                            </Label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No hay herramientas disponibles.
                        </p>
                      )}
                    </div>
                    <Button onClick={() => handleAssign('tool')} className="w-full">
                      Asignar Herramientas
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="epp">
                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-medium">EPP Disponible</h3>
                        <div className="space-y-2 rounded-md border p-4 max-h-60 overflow-y-auto">
                        {availableEpps.length > 0 ? (
                        availableEpps.map((epp) => (
                            <div key={epp.id} className="flex items-center gap-2">
                                <Checkbox
                                id={`epp-${epp.id}`}
                                checked={!!selectedEpps[epp.id]}
                                onCheckedChange={() => handleEppSelection(epp.id)}
                                />
                                <Label htmlFor={`epp-${epp.id}`} className="font-normal">
                                {epp.name}
                                </Label>
                            </div>
                        ))
                        ) : (
                        <p className="text-sm text-muted-foreground">
                            No hay EPP disponible.
                        </p>
                        )}
                      </div>
                      <Button onClick={() => handleAssign('epp')} className="w-full">
                        Asignar EPP
                      </Button>
                    </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Artículos Asignados</CardTitle>
                <CardDescription>
                    Resumen de herramientas y EPP asignados a cada empleado.
                </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
                {employees.map(employee => {
                    const assigned = getAssignedItems(employee.id);
                    if (assigned.length === 0) return null;
                    
                    const tools = assigned.filter(i => i.type === 'Herramienta');
                    const epps = assigned.filter(i => i.type === 'EPP');
                    
                    return (
                        <div key={employee.id} className="mb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold">{employee.name}</h4>
                                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                                </div>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">Devolver Todo</Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>¿Confirmar devolución?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta acción marcará todos los artículos asignados a {employee.name} como devueltos. Esta acción no se puede deshacer.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleReturnAll(employee)}>
                                        Confirmar Devolución
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <h5 className="font-medium text-sm">Herramientas</h5>
                                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                        {tools.length > 0 ? tools.map(item => (
                                            <li key={item.id}>{item.name}</li>
                                        )) : <li>Ninguna</li>}
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-medium text-sm">EPP</h5>
                                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                        {epps.length > 0 ? epps.map(item => (
                                            <li key={item.id}>{item.name}</li>
                                        )) : <li>Ninguno</li>}
                                    </ul>
                                </div>
                            </div>
                            <Separator className="mt-4" />
                        </div>
                    )
                })}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
