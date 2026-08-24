import type { InputProps } from "../types/types.tsx";

export default function Checkbox({ texto, onClick, className }: InputProps) {
  return (
    <div className={`flex items-center ${className || ""}`}> 
      <label className="relative inline-flex items-center cursor-pointer p-0!">
        <div className="relative flex items-center justify-center h-6 w-6">
          <input
            type="checkbox"
            id="custom-check"
            onClick={onClick} 
            className="peer appearance-none h-6 w-6 border border-gray-300 rounded-sm
                   checked:bg-[#C59958] checked:border-[#C59958]! 
                   focus:outline-none focus:ring-2 focus:ring-[#C59958]
                   transition duration-200 cursor-pointer"
            required
          />
        </div>
      </label>
      
      <label
        htmlFor="custom-check"
        className="text-white cursor-pointer select-none mx-2 text-[18px]"
      >
        {texto} 
      </label>
    </div>
  );
}