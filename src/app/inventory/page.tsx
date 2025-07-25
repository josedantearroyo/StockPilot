
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { InventoryTable } from './inventory-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Boxes, CheckCircle, AlertTriangle, Wrench } from 'lucide-react';
import { AddItemDialog } from './add-item-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ItemType } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { inventory as inventoryData } from '@/lib/data';

const ITEMS_PER_PAGE = 5;

export default function InventoryPage() {
  const [typeFilter, setTypeFilter] = useState<ItemType | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredInventory = inventoryData.filter(item => {
    if (typeFilter === 'all') return true;
    return item.type === typeFilter;
  });

  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);
  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (value: ItemType | 'all') => {
    setTypeFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
  }

  const totalItems = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
  const availableItems = inventoryData.filter(item => item.status === 'Disponible').length;
  const assignedItems = inventoryData.filter(item => item.status === 'Asignado').length;
  const maintenanceItems = inventoryData.filter(item => item.status === 'En Mantenimiento').length;

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
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceItems}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <div className="flex items-center gap-4">
                <Label htmlFor="type-filter">Filter by Type</Label>
                <Select
                value={typeFilter}
                onValueChange={(value) => handleFilterChange(value as ItemType | 'all')}
                >
                <SelectTrigger id="type-filter" className="w-[180px]">
                    <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Herramienta">Herramienta</SelectItem>
                    <SelectItem value="Material">Material</SelectItem>
                    <SelectItem value="EPP">EPP</SelectItem>
                </SelectContent>
                </Select>
          </div>
        </CardHeader>
        <CardContent>
          <InventoryTable 
            data={paginatedInventory} 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
