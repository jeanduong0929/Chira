"use client";

import React, { useState } from "react";
import { ChevronDown, Lock, Search, Trash } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useProject } from "@/store/use-project";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";

const MembersPage = () => {
  const [projectId] = useProject();
  const [name, setName] = useState("");
  const [updateConfirm, ConfirmRoleDialog] = useConfirm();

  const { data: members } = useQuery(
    convexQuery(api.members.getMembers, {
      projectId: projectId as Id<"projects">,
    }),
  );
  const { data: access } = useQuery(
    convexQuery(api.members.getAccess, {
      projectId: projectId as Id<"projects">,
    }),
  );
  const { data: user } = useQuery(convexQuery(api.users.getAuth, {}));

  console.log(members);

  return (
    <>
      <ConfirmRoleDialog
        title="Confirm Role Update"
        description="Are you sure you want to update this member's role?"
      />

      <div className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-5">
          <h1 className="text-2xl font-semibold">Projects</h1>

          <div className="relative flex w-[224px] items-center">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Search projects"
            />
            <Search className="absolute right-5 size-3" />
          </div>
        </div>

        <Table>
          <TableCaption>A list of your recent projects.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members?.map((member) => (
              <TableRow key={member._id}>
                <TableCell>
                  <div className="flex items-center gap-x-2">
                    <Avatar className="size-5">
                      <AvatarImage src={member.user.imageUrl} />
                      <AvatarFallback>{member.user.name}</AvatarFallback>
                    </Avatar>
                    <span>{member.user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{member.user.email}</TableCell>
                <TableCell>
                  {access?.role === "admin" &&
                  member.clerkId !== user?.clerkId ? (
                    <SwitchRoleDropdown
                      member={member}
                      updateConfirm={updateConfirm}
                    />
                  ) : (
                    <Button
                      variant={"secondary"}
                      className="flex h-[32px] w-[172px] justify-between capitalize"
                    >
                      {member.role}
                      <Lock className="size-3" />
                    </Button>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {access?.role === "admin" &&
                    member.clerkId !== user?.clerkId && (
                      <Button variant={"destructive"} size={"iconSm"}>
                        <Trash />
                      </Button>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

const SwitchRoleDropdown = ({
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

export default MembersPage;
