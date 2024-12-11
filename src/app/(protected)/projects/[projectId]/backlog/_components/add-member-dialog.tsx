import React, { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { SearchUserCombobox } from "./search-user-combobox";
import { RoleSelect } from "./role-select";
import { api } from "../../../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useProject } from "@/store/use-project";

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

  const { mutate: createNotification } = useMutation({
    mutationFn: useConvexMutation(api.notifications.create),
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
            createNotification(
              {
                projectId: projectId as Id<"projects">,
                recipientId: user?.clerkId as string,
                role: role,
              },
              {
                onSuccess: (data) => {
                  if (data) {
                    toast.success("Invite sent");
                    setOpen(false);
                    setUser(null);
                    setRole("member");
                  }
                },
                onError: (error) => {
                  if (error.message?.includes("Notification already exists")) {
                    toast.error("Invite already sent");
                  } else if (error.message?.includes("Member already exists")) {
                    toast.error("Member already exists");
                  } else {
                    toast.error("Failed to send invite");
                  }
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

          <DialogFooter>
            <Button
              type="button"
              variant={"outline"}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!user || !role}>
              Add member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
