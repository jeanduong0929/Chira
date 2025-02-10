import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ReactElement } from "react"

import { useState } from "react"
interface FilterProps{
  filterByPriority: (priority:string) => void;
}
export const FilterDropDown = ({filterByPriority}:FilterProps) => {

  
  const [priorities, setPriority] = useState<string[]>(["Low", "Medium", "High", "Not Selected"]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filter</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {
            priorities.map((priority, key) => (
                <DropdownMenuItem key={key} onClick={() => filterByPriority(priority)}>{priority}</DropdownMenuItem>
            ))
        }

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
