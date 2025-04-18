import { ApiKeyCreateDialog } from "@/components/api-keys/api-key-create-dialog";
import { ApiKeysList } from "@/components/api-keys/api-keys-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import * as React from "react";

export function ApiKeysCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card className={cn("w-full bg-muted", className)} {...props}>
      <CardHeader>
        <CardTitle>Secret Keys</CardTitle>
        <CardDescription>
          Securely manage these sensitive keys. Do not share them with anyone.
          If you suspect that one of your secret keys has been compromised, you
          should create a new key, change the key in your code, then delete the
          compromised key.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0.5 pb-0.5">
        <Card>
          <CardContent className="flex flex-col gap-2 p-2">
            <ApiKeysList />
            <ApiKeyCreateDialog>
              <Button variant="secondary" className="w-fit">
                <Plus />
                Add new key
              </Button>
            </ApiKeyCreateDialog>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
