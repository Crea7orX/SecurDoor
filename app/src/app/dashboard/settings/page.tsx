import { ApiKeysCard } from "@/components/api-keys/api-keys-card";
import { DemoAlert } from "@/components/demo/demo-alert";
import * as React from "react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <DemoAlert />

      <ApiKeysCard />
    </div>
  );
}
