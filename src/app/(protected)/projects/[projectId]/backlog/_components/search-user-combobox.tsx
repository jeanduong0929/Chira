"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Check } from "lucide-react";
import { api } from "../../../../../../../convex/_generated/api";
import { Doc } from "../../../../../../../convex/_generated/dataModel";

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
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";

interface SearchUserComboboxProps {
  value: Doc<"users"> | null;
  setValue: Dispatch<SetStateAction<Doc<"users"> | null>>;
}

export function SearchUserCombobox({
  value,
  setValue,
}: SearchUserComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const { data: users } = useQuery(convexQuery(api.users.search, { query }));
  const { data: user } = useQuery(convexQuery(api.users.getAuth, {}));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
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
            "Select user..."
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            value={query}
            onValueChange={(searchValue) => setQuery(searchValue)}
            placeholder="Search user..."
          />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {users
                ?.filter((userz) => userz.clerkId !== user?.clerkId)
                .map((user) => (
                  <CommandItem
                    key={user._id}
                    value={`${user.name} ${user.email}`}
                    onSelect={() => {
                      setValue(value?._id === user._id ? null : user);
                      setOpen(false);
                    }}
                  >
                    <Avatar className="size-8">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-y-1">
                      <div className="flex items-center gap-x-2">
                        <span>{user.name}</span>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value?._id === user._id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </div>
                      <span className="text-xs text-[#808080]">
                        {user.email}
                      </span>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
