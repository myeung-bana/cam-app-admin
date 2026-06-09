import { PageHeader } from "@/components/shared/page-header";
import { ClientForm } from "../_components/client-form";

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New client"
        description="Add a new couple or event owner."
      />
      <ClientForm />
    </div>
  );
}
