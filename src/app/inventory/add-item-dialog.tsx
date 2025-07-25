
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Item, ItemType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';

export function AddItemDialog({ onAddItem }: { onAddItem: (item: Omit<Item, 'id' | 'status'>) => void }) {
  const [name, setName] = useState('');
  const [type, setType] = useState<ItemType | ''>('');
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!name || !type || quantity <= 0) {
        toast({
            variant: 'destructive',
            title: 'Error de Validación',
            description: 'Por favor, complete todos los campos correctamente.',
        });
      return;
    }
    onAddItem({ name, type, quantity });
    toast({
        title: 'Éxito',
        description: `El artículo "${name}" ha sido añadido al inventario.`,
    })
    setName('');
    setType('');
    setQuantity(1);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="ml-auto gap-1">
            <PlusCircle className="h-4 w-4" />
            Añadir Artículo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Artículo</DialogTitle>
          <DialogDescription>
            Introduzca los detalles del nuevo artículo para añadirlo al inventario.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input id="name" placeholder="Ej: Taladro Eléctrico" className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Tipo
            </Label>
            <Select value={type} onValueChange={(value) => setType(value as ItemType)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccione un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Herramienta">Herramienta</SelectItem>
                <SelectItem value="Material">Material</SelectItem>
                <SelectItem value="EPP">EPP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Cantidad
            </Label>
            <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10))} min="1" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
            </DialogClose>
          <Button onClick={handleSubmit}>Guardar Artículo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    