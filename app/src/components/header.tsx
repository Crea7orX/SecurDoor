import { LanguageSwitcher } from "@/components/language-switcher";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
        "h-12 w-full border-b border-sidebar-border bg-sidebar",
        className,
      )}
      ref={ref}
      {...props}
    >
      <nav className="flex h-full w-full items-center justify-between gap-4 p-2 px-4">
        {/*Required div when is sidebar trigger is hidden*/}
        <div>
          <SidebarTrigger className="-ml-1 md:hidden" />
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher className="rounded-full" />
          <ThemeToggle className="rounded-full" />
          <UserButton
            appearance={{
              elements: {
                rootBox: "size-9 rounded-full border",
                avatarBox: "size-full",
              },
            }}
          />
        </div>
      </nav>
    </header>
  );
});
Header.displayName = "Header";

export { Header };
