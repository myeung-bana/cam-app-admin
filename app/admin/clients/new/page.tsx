import { EntityHeader } from "@/components/shared/entity-header";
import { ClientForm } from "../_components/client-form";

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <EntityHeader
        breadcrumbs={[
          { label: "Clients", href: "/admin/clients" },
          { label: "New client" },
        ]}
        title="New client"
        description="Create a client account and send a portal invitation."
      />
      <ClientForm />
    </div>
  );
}
