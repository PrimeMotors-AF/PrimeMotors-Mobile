import type {SpecDescriptionProps} from '../../../types/types'

export default function SpecDescription({ titulo, valor }: SpecDescriptionProps) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-black text-gray-900">{titulo}</p>
      <p className="text-xs font-bold text-gray-600">
        {valor || "N/A"} 
      </p>
    </div>
  );
}