import React, { Dispatch, SetStateAction } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

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

      <div className="relative flex w-[224px] items-center">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search issues"
        />
        <Search className="absolute right-5 size-3" />
      </div>
    </div>
  );
};
