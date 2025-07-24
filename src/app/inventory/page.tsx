import { PageHeader } from '@/components/page-header';
import { inventory } from '@/lib/data';
import { InventoryTable } from './inventory-table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AddItemDialog } from './add-item-dialog';

export default function InventoryPage() {
  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Manage your tools, materials, and personal protective equipment."
      >
        <AddItemDialog>
          <Button size="sm" className="ml-auto gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Item
          </Button>
        </AddItemDialog>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
          <InventoryTable data={inventory} />
        </CardContent>
      </Card>
    </div>
  );
}