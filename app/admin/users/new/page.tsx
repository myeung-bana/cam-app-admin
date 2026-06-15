import { EntityHeader } from "@/components/shared/entity-header";
import { UserForm } from "../_components/user-form";

export default function NewAdminUserPage() {
  return (
    <div className="space-y-6">
      <EntityHeader
        breadcrumbs={[
          { label: "Users", href: "/admin/users" },
          { label: "Invite user" },
        ]}
        title="Invite admin user"
        description="Add a team member who can sign in to the Memo admin panel."
      />
      <UserForm />
    </div>
  );
}
