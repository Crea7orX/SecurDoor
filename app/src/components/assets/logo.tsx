import SiteLogo from "@/../public/assets/logo.png";
import SiteLogoWhite from "@/../public/assets/logo_white.png";
import Image from "next/image";
import * as React from "react";

const Logo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div className={className} ref={ref} {...props}>
      <Image
        src={SiteLogo}
        alt="Logo"
        width={256}
        height={128}
        className="size-full dark:hidden"
      />
      <Image
        src={SiteLogoWhite}
        alt="Logo"
        width={256}
        height={128}
        className="hidden size-full dark:block"
      />
    </div>
  );
});
Logo.displayName = "Logo";

export { Logo };
