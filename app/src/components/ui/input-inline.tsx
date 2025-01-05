import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  keys?: string[];
  onUpdate?: (value: string) => void;
}

const InputInline = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, keys = ["Escape", "Tab", "Enter"], onUpdate, ...props },
    ref,
  ) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (props.onKeyDown) props.onKeyDown(event);

      const { key } = event;
      if (keys.includes(key)) {
        event.currentTarget.blur();
      }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      if (props.onBlur) props.onBlur(event);

      if (onUpdate) {
        onUpdate(event.currentTarget.value);
      }
    };

    return (
      <Input
        type={type}
        className={cn("border-none focus:border", className)}
        ref={ref}
        {...props}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
    );
  },
);
InputInline.displayName = "InputInline";

export { InputInline };
