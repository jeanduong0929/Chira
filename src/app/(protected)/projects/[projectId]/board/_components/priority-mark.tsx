import { useState } from "react"


export const PriorityMark = ({issuePriority} : {
    issuePriority: "low" | "medium" | "high";
  }) => {
   
    return(
       <div className={`bg-priority-${issuePriority} px-2 py-1 text-stone-100		text-xs rounded-xl	font-bold	`}>{issuePriority[0].toUpperCase()}</div>
    )

}