
import imgBuggatiChiron from "../pages/Home/Assets/imgBuggatiChiron.jpg";
import imgMcLaren750s from "../pages/Home/Assets/imgMcLaren750s.jpg";
import imgMustang from "../pages/Home/Assets/imgMustang.jpg";
import imgPorsche911 from "../pages/Home/Assets/imgPorsche911.jpg";
import imgUrusSE from "../pages/Home/Assets/imgUrusSE.jpg";
import type { Review } from "../types/types.tsx"


export const UserReviews: Review[] = [
  {
    id: 1,
    name: "Aitom Donatoni",
    content: "Uma obra-prima da engenharia. A precisão na entrega e o atendimento personalizado refletem o verdadeiro padrão da marca.",
    carPurchased: "McLaren750s",
    img: imgMcLaren750s,
    stars: 10,
  },
  {
    id: 2,
    name: "Fernando Consolin",
    content: "A harmonia perfeita entre robustez e sofisticação. Superou todas as minhas expectativas em termos de performance e conforto.",
    carPurchased: "Lamborghini Urus SE",
    img: imgUrusSE,
    stars: 10,
  },
  {
    id: 3,
    name: "Hiago Nascimento",
    content: "Um ícone que dispensa apresentações. O processo de aquisição foi conduzido com a máxima discrição e profissionalismo.",
    carPurchased: "Porsche 911 GT3R",
    img: imgPorsche911,
    stars: 10,
  },
  {
    id: 4,
    name: "Ronald",
    content: "A excelência em cada detalhe. É, sem dúvida, a definição máxima de exclusividade e poder automotivo.",
    carPurchased: "Buggati Chiron",
    img: imgBuggatiChiron,
    stars: 10,
  },
  {
    id: 5,
    name: "Francesco",
    content: "Raridade em estado de conservação impecável. Adquirir um clássico desta linhagem requer confiança, e a experiência foi brilhante. ",
    carPurchased: "Mustang 1969",
    img: imgMustang,
    stars: 10,
  },
];