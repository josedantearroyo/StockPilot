
import { PageHeader } from '@/components/page-header';
import { inventory, employees } from '@/lib/data';
import { DiscrepancyForm } from './discrepancy-form';
import type { Item } from '@/lib/types';

export default function DiscrepancyPage() {
  const inventoryData = inventory.reduce((acc: Record<string, number>, item: Item) => {
    acc[item.name] = item.quantity;
    return acc;
  }, {});

  const assignmentData = employees.reduce((acc: Record<string, string[]>, employee) => {
      const assignedItems = inventory
        .filter((item) => item.assignedTo === employee.id)
        .map((item) => item.name);
      
      if (assignedItems.length > 0) {
        acc[`${employee.firstName} ${employee.lastName}`] = assignedItems;
      }
      return acc;
    }, {});

  return (
    <div>
      <PageHeader
        title="Reporte de Discrepancias con IA"
        description="Analiza los datos de inventario y los registros de asignación para identificar discrepancias."
      />
      <DiscrepancyForm
        inventoryJson={JSON.stringify(inventoryData, null, 2)}
        assignmentsJson={JSON.stringify(assignmentData, null, 2)}
      />
    </div>
  );
}

    