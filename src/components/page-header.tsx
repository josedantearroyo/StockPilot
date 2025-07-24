type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-foreground">
        {title}
      </h1>
      {description && (
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          {description}
        </p>
      )}
    </div>
  );
}
