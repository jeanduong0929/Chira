import React, { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const RoleSelect = ({
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
