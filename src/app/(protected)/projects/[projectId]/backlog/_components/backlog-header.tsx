import React, { Dispatch, SetStateAction, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { SearchUserCombobox } from "./search-user-combobox";
import { api } from "../../../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../../../convex/_generated/dataModel";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProject } from "@/store/use-project";

export const BacklogHeader = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}) => {
  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);

  return (
    <>
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

          <Button
            onClick={() => setOpenAddMemberDialog(true)}
            className="rounded-full bg-[#E4E5E9] hover:bg-[#D0D4DA]"
            variant={"ghost"}
            size={"icon"}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              height="1em"
              width="1em"
            >
              <path d="M4.5 8.552c0 1.995 1.505 3.5 3.5 3.5s3.5-1.505 3.5-3.5-1.505-3.5-3.5-3.5-3.5 1.505-3.5 3.5zM19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 19h10v-1c0-2.757-2.243-5-5-5H7c-2.757 0-5 2.243-5 5v1h2z" />
            </svg>
          </Button>
        </div>
      </div>

      <AddMemberDialog
        open={openAddMemberDialog}
        setOpen={setOpenAddMemberDialog}
      />
    </>
  );
};

export const AddMemberDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [projectId, setProjectId] = useProject();
  const [user, setUser] = useState<Doc<"users"> | null>(null);
  const [role, setRole] = useState<"admin" | "member">("member");

  const { mutate: createMember } = useMutation({
    mutationFn: useConvexMutation(api.members.create),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setUser(null);
        setRole("member");
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add member</DialogTitle>
          <DialogDescription>
            Add a member to the project to give them access to the project.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-y-8"
          onSubmit={(e) => {
            e.preventDefault();

            createMember(
              {
                projectId: projectId as Id<"projects">,
                clerkId: user?.clerkId as string,
                role: role,
              },
              {
                onSuccess: (data) => {
                  if (data) {
                    toast.success("Member added");
                    setUser(null);
                    setRole("member");
                    setOpen(false);
                  }
                },
                onError: (error) => {
                  // Extract the clean error message from the Convex error
                  const errorMessage = error.message?.includes(
                    "Member already exists",
                  )
                    ? "This user is already a member of the project"
                    : "Failed to add member";
                  toast.error(errorMessage);
                },
              },
            );
          }}
        >
          <div className="flex flex-col gap-y-2">
            <Label>Email</Label>
            <SearchUserCombobox value={user} setValue={setUser} />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Role</Label>
            <RoleSelect role={role} setRole={setRole} />
          </div>

          <Button type="submit" disabled={!user || !role}>
            Add member
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const RoleSelect = ({
  role,
  setRole,
}: {
  role: "admin" | "member";
  setRole: Dispatch<SetStateAction<"admin" | "member">>;
}) => {
  return (
    <Select
      defaultValue={role ?? "member"}
      onValueChange={(value) => setRole(value as "admin" | "member")}
    >
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="member">Member</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
};
