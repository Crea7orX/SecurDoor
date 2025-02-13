"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as React from "react";

export default function SwitchActiveOrganizationPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    queryClient.clear();
    router.replace("/dashboard");
  }, []);

  return null;
}
