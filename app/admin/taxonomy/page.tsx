import Link from "next/link";
import { Tags } from "lucide-react";
import { getTaxonomyCounts } from "@/lib/data/taxonomy";
import { TAXONOMY_KINDS, getTaxonomyConfig } from "@/lib/taxonomy/registry";
import { EntityHeader } from "@/components/shared/entity-header";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function TaxonomyIndexPage() {
  const counts = await getTaxonomyCounts();

  return (
    <div className="space-y-6">
      <EntityHeader
        breadcrumbs={[{ label: "Taxonomy" }]}
        title="Taxonomy"
        description="Customize reusable options across Memo — event types and challenge templates."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {TAXONOMY_KINDS.map((kind) => {
          const config = getTaxonomyConfig(kind);
          return (
            <Card key={kind}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Tags className="h-4 w-4 text-muted-foreground" />
                  {config.label}
                </CardTitle>
                <CardDescription>{config.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {counts[kind]} {counts[kind] === 1 ? "item" : "items"}
                </p>
                <Link
                  href={`/admin/taxonomy/${kind}`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Manage
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
