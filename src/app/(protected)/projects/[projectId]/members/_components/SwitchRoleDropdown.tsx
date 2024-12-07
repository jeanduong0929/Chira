import React from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Doc } from "../../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../../convex/_generated/api";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { useConfirm } from "@/hooks/use-confirm";

export const SwitchRoleDropdown = ({
  member,
  updateConfirm,
}: {
  member: Doc<"members">;
  updateConfirm: ReturnType<typeof useConfirm>[0];
}) => {
  const { mutate: updateRole } = useMutation({
    mutationFn: useConvexMutation(api.members.updateRole),
  });

  const handleUpdateRole = async (role: "admin" | "member") => {
    const ok = await updateConfirm();
    if (!ok) return;

    updateRole(
      {
        memberId: member._id,
        role,
      },
      {
        onSuccess: (data) => {
          if (data) {
            toast.success("Role updated");
          }
        },
      },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"secondary"}
          className="flex h-[32px] w-[172px] justify-between"
        >
          <span className="capitalize">{member.role}</span>
          <ChevronDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[172px]">
        <DropdownMenuItem onClick={() => handleUpdateRole("admin")}>
          Admin
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleUpdateRole("member")}>
          Member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
