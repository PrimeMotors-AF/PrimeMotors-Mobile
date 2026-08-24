interface CheckboxProps {
  isActive?: boolean; 
}

export default function CheckboxActive({ isActive }: CheckboxProps) {
  return (
    <div className="flex items-center space-x-3 pointer-events-none">
      <label className="relative inline-flex items-center">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={isActive} 
          readOnly 
        />

        <div
          className={`w-11 h-6 bg-[#121212] peer-focus:outline-none rounded-sm 
                peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                after:bg-white after:border-gray-300 after:border after:rounded-sm
                after:h-5 after:w-5 after:transition-all
                ${isActive 
                  ? "after:translate-x-full border-white bg-[#C59958]" 
                  : ""
                }`}
        ></div>
      </label>
    </div>
  );
}