import { useState } from "react"


export const PriorityMark = ({issuePriority} : {
    issuePriority: "low" | "medium" | "high";
  }) => {
   
    return(
       <div className={`bg-priority-${issuePriority} pl-[0.3px] pr-[1px] text-stone-100 rounded-full w-6 h-6 flex items-center justify-center font-bold`}>
        <span className="text-[11px]">{issuePriority[0].toUpperCase()}</span>
        </div>
    )

}