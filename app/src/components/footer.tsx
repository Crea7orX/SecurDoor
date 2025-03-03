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
        "h-auto w-full border-t border-sidebar-border bg-sidebar",
        className,
      )}
      ref={ref}
      {...props}
    >
      <div className="flex min-h-[calc(3rem-1px)] items-center justify-between gap-2 p-2 px-4">
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
      </div>
    </footer>
  );
});
Footer.displayName = "Footer";

export { Footer };
