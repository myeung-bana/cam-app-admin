import { notFound } from "next/navigation";
import { getEventTypeOptions } from "@/lib/data/taxonomy";
import { getTaxonomyConfig, isTaxonomyKind } from "@/lib/taxonomy/registry";
import { EntityHeader } from "@/components/shared/entity-header";
import { TaxonomyForm } from "../../_components/taxonomy-form";

interface Props {
  params: Promise<{ kind: string }>;
}

export default async function NewTaxonomyPage({ params }: Props) {
  const { kind } = await params;
  if (!isTaxonomyKind(kind)) notFound();

  const config = getTaxonomyConfig(kind);
  const eventTypeOptions =
    kind === "challenges" ? await getEventTypeOptions() : [];

  return (
    <div className="space-y-6">
      <EntityHeader
        breadcrumbs={[
          { label: "Taxonomy", href: "/admin/taxonomy" },
          { label: config.label, href: `/admin/taxonomy/${kind}` },
          { label: "New" },
        ]}
        title={`New ${config.singularLabel.toLowerCase()}`}
        description={config.description}
      />
      <TaxonomyForm kind={kind} eventTypeOptions={eventTypeOptions} />
    </div>
  );
}
