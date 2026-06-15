import { notFound } from "next/navigation";
import {
  getEventTypeTaxonomyById,
  getChallengeTaxonomyById,
  getEventTypeOptions,
} from "@/lib/data/taxonomy";
import { getTaxonomyConfig, isTaxonomyKind } from "@/lib/taxonomy/registry";
import { EntityHeader } from "@/components/shared/entity-header";
import { formatDateTime } from "@/lib/utils/format";
import { TaxonomyForm } from "../../_components/taxonomy-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  params: Promise<{ kind: string; id: string }>;
}

export default async function TaxonomyDetailPage({ params }: Props) {
  const { kind, id } = await params;
  if (!isTaxonomyKind(kind)) notFound();

  const config = getTaxonomyConfig(kind);
  const item =
    kind === "event-types"
      ? await getEventTypeTaxonomyById(id)
      : await getChallengeTaxonomyById(id);

  if (!item) notFound();

  const eventTypeOptions =
    kind === "challenges" ? await getEventTypeOptions() : [];

  return (
    <div className="space-y-6">
      <EntityHeader
        breadcrumbs={[
          { label: "Taxonomy", href: "/admin/taxonomy" },
          { label: config.label, href: `/admin/taxonomy/${kind}` },
          { label: item.label },
        ]}
        title={item.label}
        badge={
          <Badge variant={item.active ? "default" : "secondary"}>
            {item.active ? "Active" : "Inactive"}
          </Badge>
        }
        description={`Slug: ${item.slug}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Sort order</p>
              <p className="font-medium">{item.sort_order}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">{formatDateTime(item.created_at)}</p>
            </div>
            {item.updated_at && (
              <div>
                <p className="text-muted-foreground">Last updated</p>
                <p className="font-medium">{formatDateTime(item.updated_at)}</p>
              </div>
            )}
            {kind === "challenges" && (
              <>
                <div>
                  <p className="text-muted-foreground">Icon</p>
                  <p className="text-2xl">{(item as typeof item & { icon: string }).icon}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Event type</p>
                  <p className="font-medium">
                    {(item as typeof item & { event_type_slug: string | null }).event_type_slug ?? "All types"}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <TaxonomyForm
            kind={kind}
            item={item}
            eventTypeOptions={eventTypeOptions}
          />
        </div>
      </div>
    </div>
  );
}
