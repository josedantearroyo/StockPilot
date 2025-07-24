
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

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

    const toolsToAssign = Object.keys(selectedTools).filter(
      (toolId) => selectedTools[toolId]
    );

    if (toolsToAssign.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Por favor, seleccione al menos una herramienta.',
      });
      return;
    }

    // This is where you would typically update your backend/database
    console.log(
      `Asignando ${toolsToAssign.join(', ')} a ${selectedEmployee.name}`
    );

    toast({
      title: 'Asignación Exitosa',
      description: `${
        toolsToAssign.length
      } herramienta(s) asignada(s) a ${selectedEmployee.name}.`,
    });

    // Reset selection
    setSelectedTools({});
  };
  
  const getAssignedTools = (employeeId: string): Item[] => {
    return inventory.filter(item => item.assignedTo === employeeId);
  }

  return (
    <div>
      <PageHeader
        title="Asignación de Herramientas"
        description="Asigne herramientas a los empleados para el trabajo diario."
      />
      <div className="grid gap-8 md:grid-cols-2">
        {/* Employee Selection and Assignment */}
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
              <>
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Herramientas Disponibles</h3>
                    <div className="space-y-2 rounded-md border p-4 max-h-60 overflow-y-auto">
                    {availableTools.length > 0 ? (
                      availableTools.map((tool) => (
                        <div key={tool.id} className="flex items-center gap-2">
                          <Checkbox
                            id={tool.id}
                            checked={!!selectedTools[tool.id]}
                            onCheckedChange={() => handleToolSelection(tool.id)}
                          />
                          <Label htmlFor={tool.id} className="font-normal">
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
                </div>
                <Button onClick={handleAssign} className="w-full">
                  Asignar Herramientas Seleccionadas
                </Button>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Assigned Tools */}
        <Card>
            <CardHeader>
                <CardTitle>Herramientas Asignadas</CardTitle>
            </CardHeader>
            <CardContent>
                {employees.map(employee => {
                    const assigned = getAssignedTools(employee.id);
                    if (assigned.length === 0) return null;
                    return (
                        <div key={employee.id} className="mb-4">
                            <h4 className="font-semibold">{employee.name}</h4>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                {assigned.map(item => (
                                    <li key={item.id}>{item.name}</li>
                                ))}
                            </ul>
                            <Separator className="mt-2" />
                        </div>
                    )
                })}
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
