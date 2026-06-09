import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <h2 className="text-lg font-semibold">Page not found</h2>
      <p className="text-sm text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link href="/admin/dashboard" className={buttonVariants()}>
        Back to dashboard
      </Link>
    </div>
  );
}
