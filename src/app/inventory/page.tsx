import { PageHeader } from '@/components/page-header';
import { inventory } from '@/lib/data';
import { InventoryTable } from './inventory-table';
import { Card, CardContent } from '@/components/ui/card';

export default function InventoryPage() {
  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Manage your tools, materials, and personal protective equipment."
      />
      <Card>
        <CardContent className="pt-6">
          <InventoryTable data={inventory} />
        </CardContent>
      </Card>
    </div>
  );
}
