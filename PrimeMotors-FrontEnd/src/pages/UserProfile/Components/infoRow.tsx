import type { InfoRowProps } from "../../../types/types";


const InfoRow = ({ label, value, onEdit }: InfoRowProps) => {
  return (
    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
      <span className="text-lg uppercase tracking-widest text-gray-400">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <span className="text-lg font-medium break-all ml-4">
          {value}
        </span>
        {onEdit && (
          <button 
            onClick={onEdit} 
            className="hover:text-gray-400 transition-colors scale-105"
          >
            <i className="bi bi-pencil-square"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default InfoRow;