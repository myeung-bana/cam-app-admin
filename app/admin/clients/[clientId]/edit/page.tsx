import { notFound } from "next/navigation";
import { getClientById } from "@/lib/data/clients";
import { EntityHeader } from "@/components/shared/entity-header";
import { ClientForm } from "../../_components/client-form";

interface Props {
  params: Promise<{ clientId: string }>;
}

export default async function EditClientPage({ params }: Props) {
  const { clientId } = await params;
  const client = await getClientById(clientId);

  if (!client) notFound();

  return (
    <div className="space-y-6">
      <EntityHeader
        breadcrumbs={[
          { label: "Clients", href: "/admin/clients" },
          { label: client.name, href: `/admin/clients/${clientId}` },
          { label: "Edit" },
        ]}
        title="Edit client"
        description={`Update details for ${client.name}.`}
      />
      <ClientForm client={client} />
    </div>
  );
}
