import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllEventTypeTaxonomy,
  getChallengeTaxonomy,
} from "@/lib/data/taxonomy";
import { getTaxonomyConfig, isTaxonomyKind } from "@/lib/taxonomy/registry";
import { EntityHeader } from "@/components/shared/entity-header";
import { TaxonomyTable } from "../_components/taxonomy-table";
import { buttonVariants } from "@/components/ui/button";

interface Props {
  params: Promise<{ kind: string }>;
}

export default async function TaxonomyListPage({ params }: Props) {
  const { kind } = await params;
  if (!isTaxonomyKind(kind)) notFound();

  const config = getTaxonomyConfig(kind);
  const items =
    kind === "event-types"
      ? await getAllEventTypeTaxonomy()
      : await getChallengeTaxonomy();

  return (
    <div className="space-y-6">
      <EntityHeader
        breadcrumbs={[
          { label: "Taxonomy", href: "/admin/taxonomy" },
          { label: config.label },
        ]}
        title={config.label}
        description={config.description}
      >
        <Link
          href={`/admin/taxonomy/${kind}/new`}
          className={buttonVariants({ size: "sm" })}
        >
          Add {config.singularLabel.toLowerCase()}
        </Link>
      </EntityHeader>

      <TaxonomyTable kind={kind} items={items} />
    </div>
  );
}
