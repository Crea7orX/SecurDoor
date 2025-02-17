import { cn } from "@/lib/utils";
import Link from "next/link";
import * as React from "react";

const Footer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <footer
      className={cn(
        "flex h-12 w-full items-center justify-between border-t border-sidebar-border bg-sidebar p-2 px-4",
        className,
      )}
      ref={ref}
      {...props}
    >
      <span>
        <span className="font-bold">SecurDoor</span> by{" "}
        <Link
          href="https://github.com/Crea7orX"
          target="_blank"
          className="font-bold underline"
        >
          Hristiyan Dimitrov
        </Link>{" "}
        and{" "}
        <Link
          href="https://github.com/DeyanVNikolov"
          target="_blank"
          className="font-bold underline"
        >
          Deyan Nikolov
        </Link>{" "}
        &copy; {new Date().getFullYear()}
      </span>
      <Link href="https://github.com/Crea7orX/SecurDoor" target="_blank">
        GitHub
      </Link>
    </footer>
  );
});
Footer.displayName = "Footer";

export { Footer };
