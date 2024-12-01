"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Doc } from "../../../../../../../convex/_generated/dataModel";
import { Dispatch, SetStateAction } from "react";

interface AssigneeComboboxProps {
  members: (Doc<"members"> & { user: Doc<"users"> })[];
  value: Omit<Doc<"users">, "_creationTime"> | null;
  setValue: Dispatch<
    SetStateAction<Omit<Doc<"users">, "_creationTime"> | null>
  >;
}

export function AssigneeCombobox({
  members,
  value,
  setValue,
}: AssigneeComboboxProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    console.log("value", value);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[350px] justify-between"
        >
          {value
            ? members.find((member) => member.user._id === value?._id)?.user
                .name
            : "Select member..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0">
        <Command>
          <CommandInput placeholder="Search member..." />
          <CommandList>
            <CommandEmpty>No member found.</CommandEmpty>
            <CommandGroup>
              {members.map((member) => (
                <CommandItem
                  key={member.user._id}
                  value={member.user.name}
                  onSelect={(currentValue) => {
                    // if the current value is the same as the value, set it to empty string
                    // otherwise, set it to the member id
                    setValue(currentValue === value?._id ? null : member.user);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?._id === member.user._id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
