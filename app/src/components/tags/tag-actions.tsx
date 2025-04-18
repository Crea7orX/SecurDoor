import { TagDeleteAlertDialog } from "@/components/tags/tag-delete-alert-dialog";
import { TagUpdateDialog } from "@/components/tags/tag-update-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type TagResponse } from "@/lib/validations/tag";
import { Filter, SquarePen, Trash } from "lucide-react";
import * as React from "react";

interface TagActionsProps extends React.ComponentProps<"div"> {
  tag: TagResponse;
}

export function TagActions({ className, tag, ...props }: TagActionsProps) {
  return (
    <div
      className={cn(
        "ml-auto w-fit whitespace-nowrap rounded-md border",
        className,
      )}
      {...props}
    >
      <TagUpdateDialog tag={tag}>
        <Button
          variant="outline"
          size="icon"
          className="rounded-r-none border-0 shadow-none"
        >
          <SquarePen />
        </Button>
      </TagUpdateDialog>
      <Button
        variant="outline"
        size="icon"
        className="rounded-none border-0 border-x shadow-none"
      >
        <Filter />
      </Button>
      <TagDeleteAlertDialog id={tag.id}>
        <Button
          variant="outline"
          size="icon"
          className="rounded-l-none border-0 !text-destructive shadow-none"
        >
          <Trash />
        </Button>
      </TagDeleteAlertDialog>
    </div>
  );
}
