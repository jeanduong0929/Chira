
import { useState } from "react";
import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { DisplayIssuePriority } from "@/features/issues/components/display-issue-priority";
import { PriorityMark } from "@/app/(protected)/projects/[projectId]/board/_components/priority-mark";

interface FilterCardProperty{
    filterPriority: (selection:string) => void;
    closeFilterCard: () => void;
}

export const FilterCard = ({filterPriority, closeFilterCard}:FilterCardProperty) => {

    const priorities:string[]= ["High", "Medium", "Low", "None"];
    const [selectedPriority, setSelectedPriority] = useState("None");

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) : void => {
        setSelectedPriority(e.target.value);
    }

    return (
       <div className="bg-slate-100 pt-5 mt-3 pb-6 px-12 rounded-lg flex flex-col items-start w-[250px]">
            <div className="flex align-center justify-between w-full">
                <label htmlFor="priorities" className="text-md text-slate-600 ">By Priority:</label>
                <label className="text-red-400 transition ease-in-out font-extrabold cursor-pointer hover:text-red-600" onClick={closeFilterCard}>X</label>
            </div>


      <select name="priorities" className="mt-4 w-full rounded-sm px-2" onChange={handleSelectionChange}>
        {
        priorities.map((priority) => 
        <option value={priority} 
            key={priority}
            className="block w-full py-2 px-4 pr-8 bg-white border border-gray-300 
            rounded-lg shadow-md appearance-none focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition duration-150 
            ease-in-out">
            <div className={`bg-priority-low px-2 py-1 text-stone-100	
            text-xs rounded-xl	font-bold`}></div>{priority}
        </option>)
        }
    </select>
    <Button className="mt-5 w-full" onClick={() => filterPriority(selectedPriority)}>Apply</Button>
        </div>
    )
}
