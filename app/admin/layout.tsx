import { requireAdminSession } from "@/lib/data/auth";
import { AdminSidebar } from "./_components/admin-sidebar";
import { AdminTopBar } from "./_components/admin-top-bar";
import { ApolloProvider } from "./_components/apollo-provider";
import { DevModeBanner } from "./_components/dev-mode-banner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return (
    <ApolloProvider>
      <div className="flex min-h-svh">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DevModeBanner />
          <AdminTopBar user={session.user} />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ApolloProvider>
  );
}
