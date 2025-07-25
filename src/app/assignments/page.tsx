
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
  
  // State for the review dialog
  const [reviewStatus, setReviewStatus] = useState<'Operativa' | 'Defectuosa'>('Operativa');
  const [defectiveAction, setDefectiveAction] = useState<'quitar' | 'cambiar'>('quitar');
  const [replacementToolId, setReplacementToolId] = useState<string | null>(null);

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

  const handleReviewSubmit = (defectiveItemId: string) => {
    const defectiveItem = inventory.find(i => i.id === defectiveItemId);
    if (!defectiveItem) return;
  
    if (reviewStatus === 'Operativa') {
        defectiveItem.lastReviewDate = new Date().toISOString();
        toast({
            title: 'Revisión Completada',
            description: `${defectiveItem.name} ha sido marcada como operativa.`,
        });
    } else { // Defectuosa
        // Mark the defective item for maintenance and unassign it
        defectiveItem.status = 'En Mantenimiento';
        const employeeId = defectiveItem.assignedTo;
        delete defectiveItem.assignedTo;
        delete defectiveItem.assignmentDate;
  
        if (defectiveAction === 'cambiar' && replacementToolId && employeeId) {
            const replacementTool = inventory.find(i => i.id === replacementToolId);
            if (replacementTool) {
                replacementTool.status = 'Asignado';
                replacementTool.assignedTo = employeeId;
                replacementTool.assignmentDate = new Date().toISOString();
                toast({
                    title: 'Cambio Realizado',
                    description: `${defectiveItem.name} fue cambiada por ${replacementTool.name}.`,
                });
            }
        } else {
            toast({
                variant: 'destructive',
                title: 'Herramienta Defectuosa',
                description: `${defectiveItem.name} ha sido marcada como defectuosa y enviada a mantenimiento.`,
            });
        }
    }
  
    // Reset review state and force re-render
    setReviewStatus('Operativa');
    setDefectiveAction('quitar');
    setReplacementToolId(null);
    setSelectedEmployee(prev => prev ? {...prev} : null);
  };
  
  const resetReviewDialog = () => {
    setReviewStatus('Operativa');
    setDefectiveAction('quitar');
    setReplacementToolId(null);
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
                                            <AlertDialog onOpenChange={(open) => !open && resetReviewDialog()}>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline" size="sm">Revisar</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Revisión de Herramienta: {item.name}</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Seleccione el estado actual de la herramienta. Si está defectuosa, podrá cambiarla o quitarla.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    
                                                    <RadioGroup value={reviewStatus} onValueChange={(val) => setReviewStatus(val as any)} className="my-4">
                                                        <Label className='font-bold'>Estado</Label>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="Operativa" id={`op-${item.id}`} />
                                                            <Label htmlFor={`op-${item.id}`}>Operativa</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="Defectuosa" id={`def-${item.id}`} />
                                                            <Label htmlFor={`def-${item.id}`}>Defectuosa</Label>
                                                        </div>
                                                    </RadioGroup>

                                                    {reviewStatus === 'Defectuosa' && (
                                                      <div className='space-y-4 rounded-md border bg-muted/50 p-4'>
                                                        <RadioGroup value={defectiveAction} onValueChange={(val) => setDefectiveAction(val as any)}>
                                                          <Label className='font-bold'>Acción a tomar</Label>
                                                          <div className="flex items-center space-x-2">
                                                              <RadioGroupItem value="quitar" id={`act-quitar-${item.id}`} />
                                                              <Label htmlFor={`act-quitar-${item.id}`}>Solo quitar de la asignación</Label>
                                                          </div>
                                                          <div className="flex items-center space-x-2">
                                                              <RadioGroupItem value="cambiar" id={`act-cambiar-${item.id}`} />
                                                              <Label htmlFor={`act-cambiar-${item.id}`}>Cambiar por otra herramienta</Label>
                                                          </div>
                                                        </RadioGroup>

                                                        {defectiveAction === 'cambiar' && (
                                                            <div className="space-y-2">
                                                                <Label htmlFor="replacement-tool">Seleccionar reemplazo</Label>
                                                                <Select onValueChange={setReplacementToolId}>
                                                                    <SelectTrigger id="replacement-tool">
                                                                        <SelectValue placeholder="Seleccione herramienta" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {availableTools.filter(t => t.id !== item.id).map(tool => (
                                                                            <SelectItem key={tool.id} value={tool.id}>
                                                                                {tool.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        )}
                                                      </div>
                                                    )}

                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction 
                                                          disabled={reviewStatus === 'Defectuosa' && defectiveAction === 'cambiar' && !replacementToolId}
                                                          onClick={() => handleReviewSubmit(item.id)}
                                                        >
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
