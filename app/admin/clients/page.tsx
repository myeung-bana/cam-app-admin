import Link from "next/link";
import { getClients } from "@/lib/data/clients";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { ClientTable } from "./_components/client-table";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Onboard clients, manage portal access, and track event history."
      >
        <Link href="/admin/clients/new" className={buttonVariants()}>
          Add client
        </Link>
      </PageHeader>

      <ClientTable clients={clients} />
    </div>
  );
}
