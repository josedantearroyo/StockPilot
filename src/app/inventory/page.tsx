
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { InventoryTable } from './inventory-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AddItemDialog } from './add-item-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ItemType, type Item } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { inventory as initialInventory } from '@/lib/data';

const ITEMS_PER_PAGE = 5;

export default function InventoryPage() {
  const [inventory, setInventory] = useState<Item[]>(initialInventory);
  const [typeFilter, setTypeFilter] = useState<ItemType | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const handleAddItem = (newItemData: Omit<Item, 'id' | 'status'>) => {
    const newItem: Item = {
        id: `${newItemData.type.charAt(0)}${String(inventory.length + 1).padStart(3, '0')}`,
        status: 'Disponible',
        ...newItemData
    };
    setInventory(prev => [...prev, newItem]);
  }

  const filteredInventory = inventory.filter(item => {
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

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Manage your tools, materials, and personal protective equipment."
      >
        <AddItemDialog onAddItem={handleAddItem} />
      </PageHeader>
      
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
