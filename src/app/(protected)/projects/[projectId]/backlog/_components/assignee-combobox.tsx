"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Check, ChevronsUpDown, User2 } from "lucide-react";
import { Doc, Id } from "../../../../../../../convex/_generated/dataModel";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[350px] justify-between"
        >
          {value ? (
            <div className="flex items-center gap-x-2">
              <Avatar className="size-5">
                <AvatarImage src={value.imageUrl} />
                <AvatarFallback>
                  {value.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span>{value.name}</span>
            </div>
          ) : (
            "Select member..."
          )}
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
                <div key={member.user._id}>
                  <CommandItem
                    value={member.user.name}
                    onSelect={() => {
                      setValue(
                        value?._id === member.user._id ? null : member.user,
                      );
                      setOpen(false);
                    }}
                  >
                    <Avatar className="size-5">
                      <AvatarImage src={member.user.imageUrl} />
                      <AvatarFallback>
                        {member.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {member.user.name}
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value?._id === member.user._id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                  <CommandItem
                    value={undefined}
                    onSelect={() => {
                      setValue(null);
                      setOpen(false);
                    }}
                  >
                    <div className="flex size-5 items-center justify-center rounded-full bg-[#525D71]">
                      <User2 className="size-3 text-white" />
                    </div>
                    <span>Unassigned</span>
                  </CommandItem>
                </div>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
