import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import * as React from "react";

const Header = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <header
      className={cn(
        "bg-sidebar border-sidebar-border h-12 w-full border-b",
        className,
      )}
      ref={ref}
      {...props}
    >
      <nav className="container top-0 flex h-full w-full items-center justify-between gap-4 p-2">
        <div>
          <SidebarTrigger className="-ml-1 md:hidden" />
        </div>
        <UserButton />
      </nav>
    </header>
  );
});
Header.displayName = "Header";

export { Header };
