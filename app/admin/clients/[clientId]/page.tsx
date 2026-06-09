import { notFound } from "next/navigation";
import { getClientById, getClientEvents } from "@/lib/data/clients";
import { EntityHeader } from "@/components/shared/entity-header";
import { ClientStatusBadge } from "@/components/shared/status-badge";
import { formatDate, formatDateTime } from "@/lib/utils/format";
import { ClientDetailActions } from "../_components/client-detail-actions";
import { ClientEventsSection } from "../_components/client-events-section";
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
  const [client, events] = await Promise.all([
    getClientById(clientId),
    getClientEvents(clientId),
  ]);

  if (!client) notFound();

  return (
    <div className="space-y-6">
      <EntityHeader
        breadcrumbs={[
          { label: "Clients", href: "/admin/clients" },
          { label: client.name },
        ]}
        title={client.name}
        badge={<ClientStatusBadge status={client.status} />}
        description={client.email}
      >
        <ClientDetailActions clientId={clientId} />
      </EntityHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Client profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Organisation</p>
              <p className="font-medium">{client.organisation ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{client.phone ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Event type preference</p>
              <p className="font-medium capitalize">
                {client.event_type_preference ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Key date</p>
              <p className="font-medium">
                {client.wedding_date ? formatDate(client.wedding_date) : "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Notes</p>
              <p className="font-medium">{client.notes ?? "—"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Portal access</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Portal status</p>
              <p className="font-medium capitalize">
                {client.status.replace("_", " ")}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Last portal login</p>
              <p className="font-medium">
                {client.portal_last_login_at
                  ? formatDateTime(client.portal_last_login_at)
                  : "Never"}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Clients receive an invitation email when their account is created.
              They set up portal access at /portal/setup.
            </p>
          </CardContent>
        </Card>
      </div>

      <ClientEventsSection client={client} events={events} />
    </div>
  );
}
