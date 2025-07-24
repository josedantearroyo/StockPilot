import { SidebarTrigger } from './ui/sidebar';

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {children}
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
        </div>
      </div>
    </div>
  );
}