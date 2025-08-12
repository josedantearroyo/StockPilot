import { SidebarTrigger } from './ui/sidebar';

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            {title}
          </h1>
          {description && (
            <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {children}
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
        </div>
      </div>
    </div>
  );
}