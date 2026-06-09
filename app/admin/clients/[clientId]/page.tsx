import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientById } from "@/lib/data/clients";
import { PageHeader } from "@/components/shared/page-header";
import { formatDate } from "@/lib/utils/format";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  params: Promise<{ clientId: string }>;
}

export default async function ClientDetailPage({ params }: Props) {
  const { clientId } = await params;
  const client = await getClientById(clientId);

  if (!client) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title={client.name} description={client.email}>
        <Link
          href={`/admin/clients/${clientId}/edit`}
          className={buttonVariants({ variant: "outline" })}
        >
          Edit client
        </Link>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Client details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{client.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{client.phone ?? "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Wedding date</p>
            <p className="font-medium">
              {client.wedding_date ? formatDate(client.wedding_date) : "—"}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-muted-foreground">Notes</p>
            <p className="font-medium">{client.notes ?? "—"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
