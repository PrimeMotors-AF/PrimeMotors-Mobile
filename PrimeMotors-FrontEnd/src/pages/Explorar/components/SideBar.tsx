import CheckboxActive from "../../../components/checkboxActive";

interface SideBarProps {
  onCategoryChange: (category: string) => void;
  selectedCategories: string[];
}

export default function SideBar({ onCategoryChange, selectedCategories }: SideBarProps) {
  const categoriasDisponiveis = [
    { label: "Esportivo", value: "Esportivo" },
    { label: "SUV", value: "SUV" },
    { label: "Super Esportivo", value: "Super Esportivo" },
    { label: "Luxo", value: "Luxo" },
  ];

  return (
    <div className="w-[25%] border-r h-full sticky top-10">
      <div className="max-w-sm p-6 rounded-xl shadow-sm space-y-8 m-2">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2">
          Filtros do Veículo
        </h3>

        <div className="space-y-4">
          {categoriasDisponiveis.map((cat) => (
            <div
              key={cat.value}
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => onCategoryChange(cat.value)}
            >
              <p className="text-sm font-semibold text-gray-700 group-hover:text-[#C59958] transition-colors">
                {cat.label}
              </p>

              <CheckboxActive isActive={selectedCategories.includes(cat.value)} />
            </div>
          ))}
        </div>

        <hr className="border-gray-100" />
      </div>
    </div>
  );
}