import { useFormatter } from "next-intl";
import * as React from "react";

interface FormattedDateProps extends React.ComponentProps<"span"> {
  date: Date;
}

export function FormattedDate({
  className,
  date,
  ...props
}: FormattedDateProps) {
  const format = useFormatter();

  return (
    <span className={className} {...props}>
      {format.dateTime(date, {
        dateStyle: "medium",
        timeStyle: "medium",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })}
    </span>
  );
}
