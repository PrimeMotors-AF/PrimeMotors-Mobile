import { useState } from "react";

import type { EditConfig } from "../../../types/types";

export const EditFieldForm = ({
  config,
  onSave,
}: {
  config: EditConfig;
  onSave: (v: string) => void;
}) => {
  const [value, setValue] = useState(config.defaultValue || "");

  const handleChange = (val: string) => {
    // 1. Se for telefone, remove TUDO que não for número (letras, espaços, símbolos)
    const onlyNums = config.label.includes("Telefone")
      ? val.replace(/\D/g, "")
      : val;

    // 2. Só atualiza se estiver dentro do limite (se o limite existir)
    if (!config.maxLength || onlyNums.length <= config.maxLength) {
      setValue(onlyNums);
    }
  };

  return (
    <div className="space-y-6 p-2!">
      <input
        type={config.type || "text"}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full bg-transparent border-b border-gray-700 py-2! outline-none focus:border-white transition-colors text-white my-4"
        placeholder={config.label}
      />
      <button
        onClick={() => onSave(value)}
        className="
        cursor-pointer
        px-4 py-2
        rounded-sm
        transition
        hover:bg-gray-700
        active:scale-100 
        w-full font-bold
      "
      >
        Confirmar
      </button>
    </div>
  );
};
