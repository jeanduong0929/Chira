import React, { Dispatch, SetStateAction } from "react";
import { Search } from "lucide-react";
import { api } from "../../../../../../../convex/_generated/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";

export const BacklogHeader = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className="flex flex-col gap-y-5">
      <h1 className="text-2xl font-semibold">Backlog</h1>

      <div className="flex items-center gap-x-5">
        <div className="relative flex w-[224px] items-center">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issues"
          />
          <Search className="absolute right-5 size-3" />
        </div>
        <AddMemberDialog />
      </div>
    </div>
  );
};

export const AddMemberDialog = () => {
  const { data: users } = useQuery(convexQuery(api.users.getAll, {}));
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="rounded-full bg-[#E4E5E9] hover:bg-[#D0D4DA]"
          variant={"ghost"}
          size={"icon"}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em">
            <path d="M4.5 8.552c0 1.995 1.505 3.5 3.5 3.5s3.5-1.505 3.5-3.5-1.505-3.5-3.5-3.5-3.5 1.505-3.5 3.5zM19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 19h10v-1c0-2.757-2.243-5-5-5H7c-2.757 0-5 2.243-5 5v1h2z" />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add member</DialogTitle>
          <DialogDescription>
            Add a member to the project to give them access to the project.
          </DialogDescription>
        </DialogHeader>

        <form>
          <div className="flex flex-col gap-y-5">
            <Label>Email</Label>
            <Input placeholder="Search users" />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
