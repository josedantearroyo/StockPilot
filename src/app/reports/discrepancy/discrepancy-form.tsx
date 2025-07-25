
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Terminal, Loader2 } from 'lucide-react';
import { type InventoryDiscrepancyOutput } from '@/ai/flows/inventory-discrepancy-detection';
import { runDiscrepancyCheck } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface DiscrepancyFormProps {
  inventoryJson: string;
  assignmentsJson: string;
}

export function DiscrepancyForm({
  inventoryJson,
  assignmentsJson,
}: DiscrepancyFormProps) {
  const [inventoryData, setInventoryData] = useState(inventoryJson);
  const [assignmentData, setAssignmentData] = useState(assignmentsJson);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InventoryDiscrepancyOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await runDiscrepancyCheck({
        inventoryData,
        assignmentData,
      });
      setResult(res);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Datos de Entrada</CardTitle>
            <CardDescription>
              Proporcione los datos de inventario y asignación en formato JSON. 
              Los hemos rellenado previamente con los datos actuales del sistema para su comodidad.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="inventoryData">Niveles de Inventario Actuales</Label>
              <Textarea
                id="inventoryData"
                value={inventoryData}
                onChange={(e) => setInventoryData(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="assignmentData">Asignaciones de Empleados</Label>
              <Textarea
                id="assignmentData"
                value={assignmentData}
                onChange={(e) => setAssignmentData(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analizando...
                </>
              ) : (
                'Ejecutar Análisis'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Análisis Completo</CardTitle>
            <CardDescription>
              La IA ha analizado los datos y ha generado el siguiente reporte.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Resumen de la IA</AlertTitle>
              <AlertDescription>{result.summary}</AlertDescription>
            </Alert>
            <div>
              <h3 className="font-semibold mb-2">Discrepancias Encontradas</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Artículo</TableHead>
                      <TableHead>Esperado</TableHead>
                      <TableHead>Actual</TableHead>
                      <TableHead>Diferencia</TableHead>
                      <TableHead>Asignado a</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.discrepancies.length > 0 ? (
                      result.discrepancies.map((d) => (
                        <TableRow key={d.item}>
                          <TableCell className="font-medium">{d.item}</TableCell>
                          <TableCell>{d.expected}</TableCell>
                          <TableCell>{d.actual}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                d.difference !== 0
                                  ? 'destructive'
                                  : 'default'
                              }
                            >
                              {d.difference > 0 ? `+${d.difference}`: d.difference}
                            </Badge>
                          </TableCell>
                          <TableCell>{d.employees?.join(', ')}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No se encontraron discrepancias.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    