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
import { Terminal, Loader2, ArrowRight } from 'lucide-react';
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
            <CardTitle>Input Data</CardTitle>
            <CardDescription>
              Provide the inventory and assignment data in JSON format. We've
              pre-filled it with the current system data for your convenience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="inventoryData">Current Inventory Levels</Label>
              <Textarea
                id="inventoryData"
                value={inventoryData}
                onChange={(e) => setInventoryData(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="assignmentData">Employee Assignments</Label>
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
                  Analyzing...
                </>
              ) : (
                'Run Analysis'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Complete</CardTitle>
            <CardDescription>
              The AI has analyzed the data and generated the following report.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>AI Summary</AlertTitle>
              <AlertDescription>{result.summary}</AlertDescription>
            </Alert>
            <div>
              <h3 className="font-semibold mb-2">Discrepancies Found</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Expected</TableHead>
                      <TableHead>Actual</TableHead>
                      <TableHead>Difference</TableHead>
                      <TableHead>Assigned To</TableHead>
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
                          No discrepancies found.
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
