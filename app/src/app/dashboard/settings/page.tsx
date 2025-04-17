import { ApiKeysList } from "@/components/api-keys/api-keys-list";
import { DemoAlert } from "@/components/demo/demo-alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as React from "react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <DemoAlert />

      <Card className="w-full bg-muted">
        <CardHeader>
          <CardTitle>Secret Keys</CardTitle>
          <CardDescription>
            Securely manage these sensitive keys. Do not share them with anyone.
            If you suspect that one of your secret keys has been compromised,
            you should create a new key, change the key in your code, then
            delete the compromised key.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0.5">
          <Card>
            <CardContent className="p-2">
              <ApiKeysList />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
