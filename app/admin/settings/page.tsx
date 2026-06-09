import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Admin account and platform configuration."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nhost connection</CardTitle>
          <CardDescription>
            Backend credentials are configured via environment variables.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="list-inside list-disc space-y-1">
            <li>
              <code>NHOST_SUBDOMAIN</code> — server-side Nhost project subdomain
            </li>
            <li>
              <code>NHOST_REGION</code> — Nhost region (e.g. eu-central-1)
            </li>
            <li>
              <code>NEXT_PUBLIC_NHOST_SUBDOMAIN</code> — browser-safe subdomain
            </li>
            <li>
              <code>NEXT_PUBLIC_NHOST_REGION</code> — browser-safe region
            </li>
            <li>
              <code>QR_HMAC_SECRET</code> — secret for signing QR tokens
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
