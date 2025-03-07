"use client";

import {
  LandingNavbarDashboardButton,
  LandingNavbarLinks,
} from "@/components/landing/landing-navbar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import * as React from "react";

const LandingNavbarSheet = React.forwardRef<
  React.ElementRef<typeof SheetTrigger>,
  React.ComponentProps<typeof SheetTrigger>
>(({ className, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={className} ref={ref} {...props} asChild>
        <Button variant="outline" size="icon">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="flex flex-col gap-6 p-6">
        <nav className="flex flex-col space-y-4">
          <LandingNavbarLinks onClick={() => setOpen(false)} />
        </nav>
        <LandingNavbarDashboardButton />
      </SheetContent>
    </Sheet>
  );
});
LandingNavbarSheet.displayName = "LandingNavbarSheet";

export { LandingNavbarSheet };
