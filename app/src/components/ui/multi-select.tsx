"use client";

import { Badge, type badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, CircleX, X } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

export interface MultiSelectOption {
  key: string;
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface MultiSelectRef {
  selectedValues: MultiSelectOption[];
  input: HTMLInputElement;
}

interface MultiSelectProps extends VariantProps<typeof badgeVariants> {
  options: MultiSelectOption[];
  defaultOptions?: MultiSelectOption[];
  value?: MultiSelectOption[];
  onChange?: (value: MultiSelectOption[]) => void;
  placeholder?: string;
  heading?: string;
  maxCount?: number;
  modal?: boolean;
  className?: string;
}

const MultiSelect = React.forwardRef<MultiSelectRef, MultiSelectProps>(
  (
    {
      options,
      defaultOptions = [],
      value,
      onChange,
      placeholder = "Select options",
      heading,
      maxCount = 3,
      modal = true,
      className,
      variant,
    },
    ref,
  ) => {
    const t = useTranslations("Data_Table");

    const inputRef = React.useRef<HTMLInputElement>(null);
    const [selectedOptions, setSelectedOptions] =
      React.useState<MultiSelectOption[]>(defaultOptions);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValues: [...selectedOptions],
        input: inputRef.current!,
        focus() {
          inputRef.current?.focus();
          setIsPopoverOpen(true);
        },
      }),
      [selectedOptions],
    );

    React.useEffect(() => {
      if (value) {
        setSelectedOptions(value);
      }
    }, [value]);

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedOptions];
        newSelectedValues.pop();
        setSelectedOptions(newSelectedValues);
        onChange?.(newSelectedValues);
      }
    };

    const toggleOption = (value: MultiSelectOption) => {
      const newSelectedValues = selectedOptions.includes(value)
        ? selectedOptions.filter((v) => v !== value)
        : [...selectedOptions, value];
      setSelectedOptions(newSelectedValues);
      onChange?.(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedOptions([]);
      onChange?.([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedOptions.slice(0, maxCount);
      setSelectedOptions(newSelectedValues);
      onChange?.(newSelectedValues);
    };

    const toggleAll = () => {
      if (selectedOptions.length === options.length) {
        handleClear();
      } else {
        setSelectedOptions(options);
        onChange?.(options);
      }
    };

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modal}
      >
        <PopoverTrigger asChild>
          <Button
            onClick={handleTogglePopover}
            className={cn(
              "flex h-auto min-h-[2.5rem] w-full items-center justify-between rounded-md border bg-inherit p-1 hover:bg-inherit [&_svg]:pointer-events-auto",
              className,
            )}
          >
            {selectedOptions.length > 0 ? (
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-wrap items-center">
                  {selectedOptions.slice(0, maxCount).map((option) => {
                    const IconComponent = option?.icon;
                    return (
                      <Badge
                        key={option.key}
                        className="m-1 max-w-64 max-sm:max-w-48"
                        variant={variant}
                      >
                        {IconComponent && (
                          <IconComponent className="mr-2 h-4 w-4" />
                        )}
                        <span className="truncate">{option.label}</span>
                        <CircleX
                          className="ml-2 h-4 w-4 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleOption(option);
                          }}
                        />
                      </Badge>
                    );
                  })}
                  {selectedOptions.length > maxCount && (
                    <Badge className="m-1" variant="outline">
                      {`+ ${selectedOptions.length - maxCount}`}
                      <CircleX
                        className="ml-2 h-4 w-4 cursor-pointer"
                        onClick={(event) => {
                          event.stopPropagation();
                          clearExtraOptions();
                        }}
                      />
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <X
                    className="mx-2 h-4 cursor-pointer text-muted-foreground"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClear();
                    }}
                  />
                  <Separator orientation="vertical" className="flex h-6" />
                  <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="mx-auto flex w-full items-center justify-between">
                <span className="mx-3 text-sm text-muted-foreground">
                  {placeholder}
                </span>
                <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput
              placeholder={t("search")}
              onKeyDown={handleInputKeyDown}
              ref={inputRef}
            />
            <CommandList>
              <CommandEmpty>{t("no_results_label")}</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  key="all"
                  onSelect={toggleAll}
                  className="cursor-pointer"
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selectedOptions.length === options.length
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible",
                    )}
                  >
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <span>({t("select_all")})</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading={heading}>
                {options.map((option) => {
                  const isSelected = selectedOptions.includes(option);
                  return (
                    <CommandItem
                      key={option.key}
                      value={option.value}
                      onSelect={() => toggleOption(option)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible",
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="overflow-hidden text-ellipsis">
                        {option.label}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);
MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
