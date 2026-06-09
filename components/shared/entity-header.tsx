import { Breadcrumbs, type BreadcrumbItemDef } from "./breadcrumbs";

interface EntityHeaderProps {
  breadcrumbs: BreadcrumbItemDef[];
  title: string;
  badge?: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
}

export function EntityHeader({
  breadcrumbs,
  title,
  badge,
  description,
  children,
}: EntityHeaderProps) {
  return (
    <div className="space-y-4">
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {badge}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {children && (
          <div className="flex flex-wrap items-center gap-2">{children}</div>
        )}
      </div>
    </div>
  );
}
