import { useState } from "react";

type FilterProps = {
    openFilterCard: () => void; 
  };

export const Filter = ({openFilterCard }: FilterProps ) => {

    const handleFilerCard = (): void =>{
        openFilterCard();
    }

    return (
        <div className="flex items-center justify-center cursor-pointer hover:text-slate-300" onClick={handleFilerCard}>
            <svg className="h-5 w-5 text-slate-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
        <span className="text-slate-500 flex-2 pl-2">Filter</span>
        </div>
    )
}
