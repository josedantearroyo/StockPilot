import { Warehouse } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2.5 font-semibold text-foreground">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Warehouse className="h-5 w-5" />
      </div>
      <span className="text-lg group-data-[collapsible=icon]:hidden">
        StockPilot
      </span>
    </div>
  );
}
