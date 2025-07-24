
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { employees, inventory } from '@/lib/data';
import type { Employee, Item, ChangeRecord } from '@/lib/types';
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
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

function HistoryModal({ history, itemName, employeeName }: { history: ChangeRecord[], itemName: string, employeeName: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="h-7 px-2">Ver Historial</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Historial de Cambios: {itemName}</DialogTitle>
          <DialogDescription>
            Mostrando el historial de cambios para {employeeName}.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-60">
            <div className="space-y-2 pr-4">
            {history && history.length > 0 ? (
                <ul className="list-disc pl-5">
                {history.map((record, index) => (
                    <li key={index} className="text-sm">
                    {format(new Date(record.date), 'dd/MM/yyyy HH:mm')}
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground">No hay historial de cambios.</p>
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

export default function EppManagementPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedEpps, setSelectedEpps] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const availableEpps = inventory.filter(
    (item) => item.type === 'EPP' && item.status === 'Disponible'
  );

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId) || null;
    setSelectedEmployee(employee);
    setSelectedEpps({});
  };

  const handleEppSelection = (eppId: string) => {
    setSelectedEpps((prev) => ({
      ...prev,
      [eppId]: !prev[eppId],
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

    const itemsToAssign = Object.keys(selectedEpps).filter((id) => selectedEpps[id]);

    if (itemsToAssign.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Por favor, seleccione al menos un EPP.',
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
            item.changeHistory = [{ date: assignmentDate }];
        }
    });

    console.log(
      `Asignando ${itemsToAssign.join(', ')} a ${selectedEmployee.name} en la fecha ${assignmentDate}`
    );

    toast({
      title: 'Asignación Exitosa',
      description: `${itemsToAssign.length} EPP(s) asignado(s) a ${selectedEmployee.name}.`,
    });

    // Force re-render
    setSelectedEmployee({...selectedEmployee});
    setSelectedEpps({});
  };

  const getAssignedEpps = (employeeId: string): Item[] => {
    return inventory.filter(item => item.assignedTo === employeeId && item.type === 'EPP');
  }

  const handleReturnAll = (employee: Employee) => {
    const assigned = getAssignedEpps(employee.id);
    assigned.forEach(item => {
        item.status = 'Disponible';
        delete item.assignedTo;
        delete item.assignmentDate;
        delete item.changeHistory;
    });

    console.log(`Todos los EPPs devueltos por ${employee.name}`);
    toast({
      title: 'Devolución Exitosa',
      description: `Se han devuelto ${assigned.length} EPPs de ${employee.name}.`,
    });
    // Force re-render
    setSelectedEmployee({...employee});
  }
  
  const handleEppChange = (employee: Employee, itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (item) {
        const newChangeDate = new Date().toISOString();
        if (!item.changeHistory) {
            item.changeHistory = [];
        }
        item.changeHistory.push({ date: newChangeDate });

        console.log(`EPP ${item.name} cambiado para ${employee.name} en ${newChangeDate}`);
        toast({
            title: 'Cambio Exitoso',
            description: `Se ha cambiado el EPP ${item.name} para ${employee.name}.`
        });
        // Force re-render to show updated history
        setSelectedEmployee({...employee});
    }
  }

  return (
    <div>
      <PageHeader
        title="Gestión de EPP"
        description="Asigne y gestione el Equipo de Protección Personal para los empleados."
      />
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Asignar EPP</CardTitle>
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
                  <Button onClick={handleAssign} className="w-full">
                    Asignar EPP
                  </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>EPP Asignado</CardTitle>
            <CardDescription>
              Resumen de EPP asignado a cada empleado.
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto">
            {employees.map(employee => {
              const assigned = getAssignedEpps(employee.id);
              if (assigned.length === 0) return null;

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
                            Esta acción marcará todos los EPPs asignados a {employee.name} como devueltos. Esta acción no se puede deshacer.
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
                  <div className="mt-2">
                      <h5 className="font-medium text-sm">EPP Asignado</h5>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2 mt-2">
                          {assigned.map(item => (
                              <li key={item.id} className="flex justify-between items-center">
                                <div>
                                  <span>
                                    {item.name} - <span className="text-xs">Últ. Cambio: {item.changeHistory && item.changeHistory.length > 0 ? format(new Date(item.changeHistory[item.changeHistory.length - 1].date), 'dd/MM/yyyy HH:mm') : 'N/A'}</span>
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <HistoryModal history={item.changeHistory || []} itemName={item.name} employeeName={employee.name} />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-7">Cambiar</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Confirmar cambio?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esto registrará un cambio para el EPP &quot;{item.name}&quot; asignado a {employee.name}. Se actualizará la fecha y hora de asignación.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleEppChange(employee, item.id)}>
                                                Confirmar Cambio
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
