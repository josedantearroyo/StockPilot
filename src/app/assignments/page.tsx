
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function AssignmentsPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedTools, setSelectedTools] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const availableTools = inventory.filter(
    (item) => item.type === 'Herramienta' && item.status === 'Disponible'
  );

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId) || null;
    setSelectedEmployee(employee);
    setSelectedTools({});
  };

  const handleToolSelection = (toolId: string) => {
    setSelectedTools((prev) => ({
      ...prev,
      [toolId]: !prev[toolId],
    }));
  };
  
  const handleAssign = () => {
    if (!selectedEmployee) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Por favor, seleccione un empleado.',
      });
      return;
    }

    const itemsToAssign = Object.keys(selectedTools).filter((id) => selectedTools[id]);
    
    if (itemsToAssign.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Por favor, seleccione al menos una herramienta.`,
      });
      return;
    }
    
    const assignmentDate = new Date().toISOString();

    itemsToAssign.forEach(itemId => {
        const item = inventory.find(i => i.id === itemId);
        if (item) {
            item.assignedTo = selectedEmployee.id;
            item.status = 'Asignado';
            item.assignmentDate = assignmentDate;
        }
    });


    console.log(
      `Asignando ${itemsToAssign.join(', ')} a ${selectedEmployee.name}`
    );

    toast({
      title: 'Asignación Exitosa',
      description: `${itemsToAssign.length} herramienta(s) asignada(s) a ${selectedEmployee.name}.`,
    });

    // Reset selection and force re-render
    setSelectedTools({});
    setSelectedEmployee({...selectedEmployee});
  };
  
  const getAssignedItems = (employeeId: string): Item[] => {
    return inventory.filter(item => item.assignedTo === employeeId && item.type === 'Herramienta');
  }

  const handleReviewSubmit = (itemId: string, status: 'Operativa' | 'Defectuosa') => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;
  
    if (status === 'Defectuosa') {
      item.status = 'En Mantenimiento';
      delete item.assignedTo;
      delete item.assignmentDate;
      toast({
        variant: 'destructive',
        title: 'Herramienta Defectuosa',
        description: `${item.name} ha sido marcada como defectuosa y enviada a mantenimiento.`,
      });
    } else {
      item.lastReviewDate = new Date().toISOString();
      toast({
        title: 'Revisión Completada',
        description: `${item.name} ha sido marcada como operativa.`,
      });
    }
  
    // Force re-render
    setSelectedEmployee(prev => prev ? {...prev} : null);
  };
  
  return (
    <div>
      <PageHeader
        title="Asignación de Herramientas"
        description="Asigne herramientas a los empleados para el trabajo diario."
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
                <Button onClick={handleAssign} className="w-full">
                  Asignar Herramientas
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Herramientas Asignadas</CardTitle>
                <CardDescription>
                    Resumen de herramientas asignadas a cada empleado.
                </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
                {employees.map(employee => {
                    const assigned = getAssignedItems(employee.id);
                    if (assigned.length === 0) return null;
                    
                    return (
                        <div key={employee.id} className="mb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold">{employee.name}</h4>
                                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                                </div>
                            </div>
                            <div className="mt-2">
                                <h5 className="font-medium text-sm">Herramientas</h5>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2 mt-2">
                                    {assigned.map(item => (
                                        <li key={item.id} className="flex justify-between items-center">
                                            <span>{item.name}</span>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline" size="sm">Revisar</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Revisión de Herramienta: {item.name}</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Seleccione el estado actual de la herramienta. Si está defectuosa, se enviará a mantenimiento.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <RadioGroup defaultValue="Operativa" id={`review-${item.id}`} className="my-4">
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="Operativa" id={`op-${item.id}`} />
                                                            <Label htmlFor={`op-${item.id}`}>Operativa</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="Defectuosa" id={`def-${item.id}`} />
                                                            <Label htmlFor={`def-${item.id}`}>Defectuosa</Label>
                                                        </div>
                                                    </RadioGroup>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => {
                                                            const status = (document.querySelector(`#review-${item.id} [aria-checked=true]`) as HTMLButtonElement)?.value as 'Operativa' | 'Defectuosa';
                                                            handleReviewSubmit(item.id, status)
                                                        }}>
                                                            Guardar
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </li>
                                    ))}
                                </ul>
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
