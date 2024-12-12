"use client";

import React, { useMemo, useState } from "react";
import { Lock, Search, Trash } from "lucide-react";
import { toast } from "sonner";
import { SwitchRoleDropdown } from "./_components/SwitchRoleDropdown";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

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
import { useConfirm } from "@/hooks/use-confirm";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

const MembersPage = () => {
  const projectId = useProjectId();
  const [name, setName] = useState("");
  const [updateConfirm, ConfirmRoleDialog] = useConfirm();
  const [removeConfirm, ConfirmRemoveDialog] = useConfirm();

  const { data: members } = useQuery(
    convexQuery(api.members.getMembers, {
      projectId,
    }),
  );
  const { data: access } = useQuery(
    convexQuery(api.members.getAccess, {
      projectId,
    }),
  );
  const { data: user } = useQuery(convexQuery(api.users.getAuth, {}));
  const { mutate: removeMember } = useMutation({
    mutationFn: useConvexMutation(api.members.remove),
  });

  /**
   * Filters the list of members based on the search input.
   *
   * This memoized function checks if the members are available and filters them
   * according to the user's input in the search field. If no input is provided,
   * it returns all members. The filtering is case-insensitive.
   *
   * @returns {Array} - An array of members that match the search criteria.
   */
  const filterMembers = useMemo(() => {
    if (!members) return [];
    if (name === "") return members;

    return members.filter((member) =>
      member.user.name.toLowerCase().includes(name.toLowerCase()),
    );
  }, [members, name]);

  return (
    <>
      <ConfirmRoleDialog
        title="Confirm Role Update"
        description="Are you sure you want to update this member's role?"
      />
      <ConfirmRemoveDialog
        title="Confirm Member Removal"
        description="Are you sure you want to remove this member?"
        confirmButtonText="Remove"
        variant="destructive"
      />

      <div className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-5">
          <h1 className="text-2xl font-semibold">Members</h1>

          <div className="relative flex w-[224px] items-center">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Search members"
            />
            <Search className="absolute right-5 size-3" />
          </div>
        </div>

        <Table>
          <TableCaption>A list of your recent members.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterMembers.map((member) => (
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
                      <Button
                        variant={"destructive"}
                        size={"iconSm"}
                        onClick={async () => {
                          const ok = await removeConfirm();
                          if (!ok) return;
                          removeMember(
                            { memberId: member._id },
                            {
                              onSuccess: (data) => {
                                if (data) {
                                  toast.success("Member removed");
                                }
                              },
                            },
                          );
                        }}
                      >
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

export default MembersPage;
