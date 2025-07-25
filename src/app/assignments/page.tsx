
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { employees, inventory } from '@/lib/data';
import type { Employee, Item, ReviewRecord } from '@/lib/types';
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter,
  } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RotateCcw, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

function ReviewHistoryModal({ history, itemName, employeeName }: { history: ReviewRecord[], itemName: string, employeeName: string }) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" size="sm" className="h-7 px-2">Ver Historial</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Historial de Revisiones: {itemName}</DialogTitle>
            <DialogDescription>
              Mostrando el historial de revisiones para {employeeName}.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-60">
              <div className="space-y-2 pr-4">
              {history && history.length > 0 ? (
                  <ul className="list-disc pl-5">
                  {history.map((record, index) => (
                      <li key={index} className="text-sm">
                        {format(new Date(record.date), 'dd/MM/yyyy HH:mm')} - {record.status}
                        {record.actionTaken && ` (${record.actionTaken})`}
                      </li>
                  ))}
                  </ul>
              ) : (
                  <p className="text-sm text-muted-foreground">No hay historial de revisiones.</p>
              )}
              </div>
          </ScrollArea>
          <DialogFooter>
              <Button onClick={(e) => (e.target as HTMLElement).closest('[role="dialog"]')?.querySelector<HTMLButtonElement>('[aria-label="Close"]')?.click()}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}

function QuickReviewModal({ employee, onReview }: { employee: Employee, onReview: (itemIds: string[]) => void }) {
    const assignedTools = inventory.filter(item => item.assignedTo === employee.id && item.type === 'Herramienta');
    const [selected, setSelected] = useState<Record<string, boolean>>({});
  
    const handleSelectAll = (checked: boolean) => {
      const newSelected: Record<string, boolean> = {};
      if (checked) {
        assignedTools.forEach(tool => {
          newSelected[tool.id] = true;
        });
      }
      setSelected(newSelected);
    };
  
    const handleSelectOne = (toolId: string) => {
      setSelected(prev => ({ ...prev, [toolId]: !prev[toolId] }));
    };
  
    const handleSubmit = () => {
      onReview(Object.keys(selected).filter(id => selected[id]));
    };

    const allSelected = assignedTools.length > 0 && assignedTools.every(t => selected[t.id]);
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="ml-2 gap-1.5 h-8">
            <RotateCcw className="h-3.5 w-3.5" />
            Revisión Rápida
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revisión Rápida Mensual</DialogTitle>
            <DialogDescription>
              Seleccione las herramientas de {employee.name} que están operativas y en buen estado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="select-all"
                    checked={allSelected}
                    onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                />
                <Label htmlFor="select-all">Seleccionar Todo</Label>
            </div>
            <Separator />
            <ScrollArea className="max-h-60">
              <div className="space-y-2 pr-4">
                {assignedTools.map(tool => (
                  <div key={tool.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tool-review-${tool.id}`}
                      checked={!!selected[tool.id]}
                      onCheckedChange={() => handleSelectOne(tool.id)}
                    />
                    <Label htmlFor={`tool-review-${tool.id}`} className="font-normal">{tool.name}</Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <DialogTrigger asChild>
                <Button variant="ghost">Cancelar</Button>
            </DialogTrigger>
            <DialogTrigger asChild>
                <Button onClick={handleSubmit} disabled={Object.keys(selected).filter(id => selected[id]).length === 0}>
                    Guardar Revisión
                </Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}

function AssignToolsModal({ availableTools, selectedTools, onToolSelection, onAssign }: { availableTools: Item[], selectedTools: Record<string, boolean>, onToolSelection: (toolId: string) => void, onAssign: () => void }) {
    
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6; 

    const totalPages = Math.ceil(availableTools.length / ITEMS_PER_PAGE);
    const paginatedTools = availableTools.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        availableTools.forEach(tool => {
            const isSelected = selectedTools[tool.id] || false;
            if ((checked && !isSelected) || (!checked && isSelected)) {
                onToolSelection(tool.id);
            }
        });
    };

    const allSelected = availableTools.length > 0 && availableTools.every(t => selectedTools[t.id]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className='w-full'>Seleccionar Herramientas</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Seleccionar Herramientas Disponibles</DialogTitle>
                    <DialogDescription>
                        Elija las herramientas que desea asignar.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="select-all-assign"
                            checked={allSelected}
                            onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                        />
                        <Label htmlFor="select-all-assign">Seleccionar Todo</Label>
                    </div>
                    <Separator />
                    <ScrollArea className="h-60">
                        <div className="rounded-md border p-4 grid grid-cols-2 gap-4">
                        {paginatedTools.length > 0 ? (
                            paginatedTools.map((tool) => (
                            <div key={tool.id} className="flex items-center gap-2">
                                <Checkbox
                                id={`assign-tool-${tool.id}`}
                                checked={!!selectedTools[tool.id]}
                                onCheckedChange={() => onToolSelection(tool.id)}
                                />
                                <Label htmlFor={`assign-tool-${tool.id}`} className="font-normal">
                                {tool.name}
                                </Label>
                            </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground col-span-2">
                            No hay herramientas disponibles.
                            </p>
                        )}
                        </div>
                    </ScrollArea>
                    <div className="flex items-center justify-end space-x-2">
                        <div className="text-sm text-muted-foreground">
                            Página {currentPage} de {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Anterior</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Siguiente</span>
                        </Button>
                    </div>
                </div>
                <DialogFooter>
                    <DialogTrigger asChild>
                        <Button variant="ghost">Cancelar</Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                        <Button onClick={onAssign}>Asignar Herramientas</Button>
                    </DialogTrigger>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

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
            if (!item.reviewHistory) {
                item.reviewHistory = [];
            }
        }
    });

    toast({
      title: 'Asignación Exitosa',
      description: `${itemsToAssign.length} herramienta(s) asignada(s) a ${selectedEmployee.name}.`,
    });

    // Reset selection and force re-render
    setSelectedTools({});
    setSelectedEmployee(prev => prev ? {...prev} : null);
  };
  
  const getAssignedItems = (employeeId: string): Item[] => {
    return inventory.filter(item => item.assignedTo === employeeId && item.type === 'Herramienta');
  }

  const handleReviewSubmit = (defectiveItemId: string) => {
    const defectiveItem = inventory.find(i => i.id === defectiveItemId);
    if (!defectiveItem) return;
    
    const newReviewRecord: ReviewRecord = {
        date: new Date().toISOString(),
        status: reviewStatus,
    };
  
    if (reviewStatus === 'Operativa') {
        defectiveItem.lastReviewDate = new Date().toISOString();
        newReviewRecord.actionTaken = 'ninguna';
        toast({
            title: 'Revisión Completada',
            description: `${defectiveItem.name} ha sido marcada como operativa.`,
        });
    } else { // Defectuosa
        newReviewRecord.actionTaken = defectiveAction === 'cambiar' ? 'cambiada' : 'quitada';
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

    if (!defectiveItem.reviewHistory) {
        defectiveItem.reviewHistory = [];
    }
    defectiveItem.reviewHistory.push(newReviewRecord);
  
    // Reset review state and force re-render
    setReviewStatus('Operativa');
    setDefectiveAction('quitar');
    setReplacementToolId(null);
    setSelectedEmployee(prev => prev ? {...prev} : null);
  };

  const handleQuickReviewSubmit = (itemIds: string[]) => {
    const reviewDate = new Date().toISOString();
    let reviewedCount = 0;

    itemIds.forEach(id => {
        const item = inventory.find(i => i.id === id);
        if (item) {
            item.lastReviewDate = reviewDate;
            if (!item.reviewHistory) {
                item.reviewHistory = [];
            }
            item.reviewHistory.push({
                date: reviewDate,
                status: 'Operativa',
                actionTaken: 'ninguna'
            });
            reviewedCount++;
        }
    });

    if (reviewedCount > 0) {
        toast({
            title: 'Revisión Rápida Completa',
            description: `${reviewedCount} herramienta(s) han sido marcadas como operativas.`
        });
        setSelectedEmployee(prev => prev ? {...prev} : null);
    }
  };

  const handleReturnTool = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    const employeeName = employees.find(e => e.id === item.assignedTo)?.name || 'un empleado';
    
    item.status = 'Disponible';
    delete item.assignedTo;
    delete item.assignmentDate;

    toast({
        title: 'Herramienta Devuelta',
        description: `${item.name} ha sido devuelta por ${employeeName} y está disponible en inventario.`
    });
    
    setSelectedEmployee(prev => prev ? {...prev} : null);
  }
  
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
                  <AssignToolsModal 
                    availableTools={availableTools}
                    selectedTools={selectedTools}
                    onToolSelection={handleToolSelection}
                    onAssign={handleAssign}
                  />
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
                            <div className="flex justify-between items-center">
                                <div className='flex items-center'>
                                    <h4 className="font-semibold">{employee.name}</h4>
                                    <QuickReviewModal employee={employee} onReview={handleQuickReviewSubmit} />
                                </div>
                                <p className="text-sm text-muted-foreground">{employee.position}</p>
                            </div>
                            <div className="mt-2">
                                <h5 className="font-medium text-sm">Herramientas</h5>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2 mt-2">
                                    {assigned.map(item => (
                                        <li key={item.id} className="flex justify-between items-center">
                                            <span>{item.name}</span>
                                            <div className="flex items-center gap-1">
                                                <ReviewHistoryModal history={item.reviewHistory || []} itemName={item.name} employeeName={employee.name} />

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-7 px-2"><Trash2 className="h-4 w-4" /></Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>¿Confirmar devolución?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Esta acción devolverá la herramienta &quot;{item.name}&quot; al inventario. El empleado ya no la tendrá asignada.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleReturnTool(item.id)}>Confirmar</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                                <AlertDialog onOpenChange={(open) => !open && resetReviewDialog()}>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className='h-7 px-2'>Revisar</Button>
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
                                            </div>
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

    