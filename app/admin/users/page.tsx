import Link from "next/link";
import { getAdminUsers } from "@/lib/data/admin-users";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { UserTable } from "./_components/user-table";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Admin users who can access the Memo operational panel."
      >
        <Link href="/admin/users/new" className={buttonVariants()}>
          Invite user
        </Link>
      </PageHeader>

      <UserTable users={users} />
    </div>
  );
}
