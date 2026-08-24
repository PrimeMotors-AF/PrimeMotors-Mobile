import { useState, useEffect } from "react";

import "./Carrosel.css";
import { logos } from "./logos";

type Props = {
  onChangeMarca: React.Dispatch<React.SetStateAction<string>>;
};


const CARROS_DATA = [
  { nome: "Todos", logo: logos.todos },
  { nome: "Lamborghini", logo: logos.lamborghini },
  { nome: "Ferrari", logo: logos.ferrari },
  { nome: "Porsche", logo: logos.porsche },
  { nome: "McLaren", logo: logos.mclaren },
  { nome: "Bugatti", logo: logos.bugatti },
  { nome: "Pagani", logo: logos.pagani },
  { nome: "Koenigsegg", logo: logos.koenigsegg },
  { nome: "Rolls-Royce", logo: logos.rolls },
  { nome: "Audi", logo: logos.audi },
  { nome: "BMW", logo: logos.bmw },
  { nome: "Mercedes-Benz", logo: logos.mercedes },
];

const EXTENDED_CARROS = [...CARROS_DATA, ...CARROS_DATA, ...CARROS_DATA];
const CENTER_OFFSET = CARROS_DATA.length; 

export default function Carrossel({ onChangeMarca }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const filtroAtual = CARROS_DATA[index].nome;

    onChangeMarca(filtroAtual);
    console.log("Filtro atual:", filtroAtual);
    
  }, [index, onChangeMarca]); // No more warnings here!

  function proximo() {
    setIndex((prev) => (prev + 1) % CARROS_DATA.length);
  }

  function anterior() {
    setIndex((prev) => (prev - 1 + CARROS_DATA.length) % CARROS_DATA.length);
  }

  return (
    <div className="carrossel-container mx-auto my-2">
      <div className="carrossel-wrapper">
        <button onClick={anterior}>◀</button>

        <div className="carrossel-viewport">
          <div
            className="carrossel-itens"
            style={{
              transform: `translateX(calc(50cqw - ${(index + CENTER_OFFSET) * 240 + 120}px))`,
            }}
          >
            {EXTENDED_CARROS.map((carro, i) => {
              let classe = "carrossel-item";

              if (i === index + CENTER_OFFSET) classe += " carrossel-centro";
              else if (
                i === index + CENTER_OFFSET - 1 ||
                i === index + CENTER_OFFSET + 1
              )
                classe += " opacity-medio";
              else classe += " opacity-fraco";
              
              return (
                <div
                  key={i}
                  className={`${classe} flex items-center justify-center`}
                >
                  <img
                    src={carro.logo}
                    alt={carro.nome}
                    className="w-[100px] h-[90px] object-contain"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={proximo}>▶</button>
      </div>
    </div>
  );
}