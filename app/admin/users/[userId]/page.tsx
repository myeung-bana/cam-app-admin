import { notFound } from "next/navigation";
import { getAdminUserById } from "@/lib/data/admin-users";
import { EntityHeader } from "@/components/shared/entity-header";
import { AdminUserStatusBadge } from "@/components/shared/status-badge";
import { formatDateTime } from "@/lib/utils/format";
import { UserForm } from "../_components/user-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function AdminUserDetailPage({ params }: Props) {
  const { userId } = await params;
  const user = await getAdminUserById(userId);

  if (!user) notFound();

  return (
    <div className="space-y-6">
      <EntityHeader
        breadcrumbs={[
          { label: "Users", href: "/admin/users" },
          { label: user.name },
        ]}
        title={user.name}
        badge={<AdminUserStatusBadge status={user.status} />}
        description={user.email}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Account overview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Role</p>
              <Badge variant="outline" className="mt-1 capitalize">
                {user.role}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">User ID</p>
              <p className="break-all font-mono text-xs">{user.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last login</p>
              <p className="font-medium">
                {user.last_login_at
                  ? formatDateTime(user.last_login_at)
                  : "Never"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">{formatDateTime(user.created_at)}</p>
            </div>
            {user.updated_at && (
              <div>
                <p className="text-muted-foreground">Last updated</p>
                <p className="font-medium">{formatDateTime(user.updated_at)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <UserForm user={user} />
        </div>
      </div>
    </div>
  );
}
