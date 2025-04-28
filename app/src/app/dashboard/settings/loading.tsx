import { ApiKeysCard } from "@/components/api-keys/api-keys-card";
import { WebhooksCard } from "@/components/webhooks/webhooks-card";

export default function SettingsLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <ApiKeysCard />
      <WebhooksCard />
    </div>
  );
}
