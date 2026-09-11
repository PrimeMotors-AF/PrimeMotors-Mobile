import { PrismaClient, Prisma, FuelType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.image.deleteMany();
  await prisma.car.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.espec.deleteMany();
  await prisma.itens.deleteMany();

  await prisma.category.createMany({
    data: [
      { name: "SUV" },
      { name: "Super Esportivo" },
      { name: "Esportivo" },
      { name: "Luxo" },
    ],
    skipDuplicates: true,
  });

  await prisma.brand.createMany({
    data: [
      { name: "Lamborghini" },
      { name: "Ferrari" },
      { name: "Porsche" },
      { name: "McLaren" },
      { name: "Bugatti" },
      { name: "Pagani" },
      { name: "Koenigsegg" },
      { name: "Rolls-Royce" },
      { name: "Audi" },
      { name: "BMW" },
      { name: "Mercedes-Benz" }
    ],
    skipDuplicates: true
  });

  const carros = [

    // Lamborghini
    {
      name: "Lamborghini Huracán",
      model: "Huracán EVO",
      value: 2400000,
      categoryName: "Super Esportivo",
      brandName: "Lamborghini",

      espec: {
        year: 2023,
        fuel: FuelType.Gasolina,
        color: "Verde oliva",
        transmission: "Automático",
        engine: "V10",
        potency: "640cv",
        max_speed: "325km/h"
      },

      itens: {
        airbag: true,
        alarm: true,
        leather_seat: true,
        cruise_control: true,
        abs: true,
        onBoard_computer: true
      },

      images: [
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788877744/lambo1_lck6cp.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788877744/lambo2_mlfhjo.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788877743/lambo3_g4erzq.jpg"
      ]
    },
    
    {
      name: "Lamborghini Aventador",
      model: "Aventador SVJ",
      value: 5800000,
      categoryName: "Super Esportivo",
      brandName: "Lamborghini",
      espec: { year: 2023, fuel: FuelType.Gasolina, color: "Giallo Orion", transmission: "Automático", engine: "6.5 V12", potency: "770cv", max_speed: "350km/h" },
      itens: { airbag: true, alarm: true, leather_seat: true, cruise_control: true, abs: true, onBoard_computer: true },
      images: ["https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776186723/2013-Lamborghini-Aventador-LP720-4-50-Anniversario-005-1600_csl2jq.jpg"
        , "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776186748/2013-Lamborghini-Aventador-LP720-4-50-Anniversario-003-1600_zitnz7.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776186749/2013-Lamborghini-Aventador-LP720-4-50-Anniversario-001-1600_zrkdpl.jpg"]
    },
    {
      name: "Lamborghini Urus",
      model: "Urus Performante",
      value: 3900000,
      categoryName: "SUV",
      brandName: "Lamborghini",
      espec: { year: 2024, fuel: FuelType.Gasolina, color: "Arancio Borealis", transmission: "Automático", engine: "4.0 V8 Biturbo", potency: "666cv", max_speed: "306km/h" },
      itens: { airbag: true, alarm: true, leather_seat: true, cruise_control: true, abs: true, onBoard_computer: true },
      images: ["https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776186617/2025-Lamborghini-Urus-SE-001_zqkkah.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776186623/2025-Lamborghini-Urus-SE-002_ha5a4z.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776186634/2025-Lamborghini-Urus-SE-004_vwedze.jpg"]
    },
    {
      name: "Lamborghini Revuelto",
      model: "V12 Hybrid",
      value: 7000000,
      categoryName: "Super Esportivo",
      brandName: "Lamborghini",
      espec: { year: 2024, fuel: FuelType.Hibrido, color: "Viola Pasifae", transmission: "Automático", engine: "6.5 V12 Hybrid", potency: "1015cv", max_speed: "350km/h" },
      itens: { airbag: true, alarm: true, leather_seat: true, cruise_control: true, abs: true, onBoard_computer: true },
      images: ["https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776186901/2026-Novitec-Lamborghini-Revuelto-001-1600_acgplg.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776186918/2026-Novitec-Lamborghini-Revuelto-002-1600_uqbj0q.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776186925/2026-Novitec-Lamborghini-Revuelto-003-1600_yqnlhn.jpg"]
    },
    // Ferrari
    {
      name: "Ferrari 488",
      model: "488 GTB",
      value: 1800000,
      categoryName: "Super Esportivo",
      brandName: "Ferrari",

      espec: {
        year: 2023,
        fuel: FuelType.Gasolina,
        color: "Teal escuro",
        transmission: "Automático",
        engine: "V8",
        potency: "670cv",
        max_speed: "330km/h"
      },

      itens: {
        airbag: true,
        alarm: true,
        leather_seat: true,
        cruise_control: true,
        abs: true,
        onBoard_computer: true
      },

      images: [
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788976923/ferrari_ui5imb.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788976922/ferrari2_nbkswk.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788976923/ferrari3_zek0d5.jpg"
      ]
    },
    // Porsche
    {
      name: "Porsche 911",
      model: "911 Carrera",
      value: 950000,
      categoryName: "Esportivo",
      brandName: "Porsche",

      espec: {
        year: 2023,
        fuel: FuelType.Gasolina,
        color: "Azul royal",
        transmission: "Automático",
        engine: "3.0 Twin Turbo",
        potency: "385cv",
        max_speed: "293km/h"
      },

      itens: {
        airbag: true,
        alarm: true,
        leather_seat: true,
        cruise_control: true,
        abs: true,
        onBoard_computer: true
      },

      images: [
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788977057/porsche1_wyzu4m.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788977057/porsche3_b5wdky.jpg",
      ]
    },
    // McLaren
    {
      name: "McLaren 720S",
      model: "720S Coupe",
      value: 2800000,
      categoryName: "Super Esportivo",
      brandName: "McLaren",

      espec: {
        year: 2023,
        fuel: FuelType.Gasolina,
        color: "Azul marinho",
        transmission: "Automático",
        engine: "4.0 V8 Twin Turbo",
        potency: "720cv",
        max_speed: "341km/h"
      },

      itens: {
        airbag: true,
        alarm: true,
        leather_seat: true,
        cruise_control: true,
        abs: true,
        onBoard_computer: true
      },

      images: [
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788977139/mclaren1_lspwpt.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788977139/mclaren2_opyay3.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788977140/mclaren3_l9m5g8.jpg"
      ]
    },

    // Bugatti
    {
      name: "Bugatti Chiron",
      model: "Chiron Sport",
      value: 18000000,
      categoryName: "Super Esportivo",
      brandName: "Bugatti",

      espec: {
        year: 2023,
        fuel: FuelType.Gasolina,
        color: "Cinza ardósia",
        transmission: "Automático",
        engine: "8.0 W16 Quad Turbo",
        potency: "1500cv",
        max_speed: "420km/h"
      },

      itens: {
        airbag: true,
        alarm: true,
        leather_seat: true,
        cruise_control: true,
        abs: true,
        onBoard_computer: true
      },

      images: [
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788977203/bugatti1_jmgxh3.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788977203/bugatti3_lvsqbs.jpg",
      ]
    },

    // Pagani
    {
      name: "Pagani Huayra",
      model: "Huayra BC",
      value: 18000000,
      categoryName: "Super Esportivo",
      brandName: "Pagani",

      espec: {
        year: 2023,
        fuel: FuelType.Gasolina,
        color: "Carbono Branco",
        transmission: "Automático",
        engine: "6.0 V12 Twin Turbo AMG",
        potency: "802cv",
        max_speed: "383km/h"
      },

      itens: {
        airbag: true,
        alarm: true,
        leather_seat: true,
        cruise_control: true,
        abs: true,
        onBoard_computer: true
      },

      images: [
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788977687/pagani1_hdnmh5.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788977687/pagani2_lf0zxa.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788977688/pagani3_ig4ye9.jpg"
      ]
    },
    //Rolls Royce
    {
      name: "Rolls-Royce Phantom",
      model: "Phantom VIII",
      value: 6000000,
      categoryName: "Luxo",
      brandName: "Rolls-Royce",

      espec: {
        year: 2023,
        fuel: FuelType.Gasolina,
        color: "Lavanda acinzentado",
        transmission: "Automático",
        engine: "6.75 V12 Twin Turbo",
        potency: "571cv",
        max_speed: "250km/h"
      },

      itens: {
        airbag: true,
        alarm: true,
        leather_seat: true,
        cruise_control: true,
        abs: true,
        onBoard_computer: true
      },

      images: [
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788977757/roll1_fzcooi.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788977757/roll2_smozkw.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788977757/roll3_zhx40q.jpg"
      ]
    },
    
    //Audi
    {
      name: "Audi R8",
      model: "R8 V10 Performance",
      value: 1400000,
      categoryName: "Esportivo",
      brandName: "Audi",

      espec: {
        year: 2023,
        fuel: FuelType.Gasolina,
        color: "Preto e vermelho race",
        transmission: "Automático",
        engine: "5.2 V10 Aspirado",
        potency: "620cv",
        max_speed: "331km/h"
      },

      itens: {
        airbag: true,
        alarm: true,
        leather_seat: true,
        cruise_control: true,
        abs: true,
        onBoard_computer: true
      },

      images: [
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788977815/audi1_xlnb3j.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788977815/audi2_wbo8vf.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788977815/audi3_piisay.jpg"
      ]
    },

    //BMW
    {
      name: "BMW M4",
      model: "M4 Competition",
      value: 800000,
      categoryName: "Esportivo",
      brandName: "BMW",

      espec: {
        year: 2023,
        fuel: FuelType.Gasolina,
        color: "Branca",
        transmission: "Automático",
        engine: "3.0 Twin Turbo",
        potency: "510cv",
        max_speed: "290km/h"
      },

      itens: {
        airbag: true,
        alarm: true,
        leather_seat: true,
        cruise_control: true,
        abs: true,
        onBoard_computer: true
      },

      images: [
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788977856/bmw3_bj6teo.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788977855/bmw1_dtdotx.jpg",
      ]
    },
    //Mercedes
    {
      name: "Mercedes-Benz AMG GT",
      model: "AMG GT 63 S",
      value: 1200000,
      categoryName: "Esportivo",
      brandName: "Mercedes-Benz",

      espec: {
        year: 2023,
        fuel: FuelType.Gasolina,
        color: "Vermelho Sangue",
        transmission: "Automático",
        engine: "4.0 V8 Biturbo",
        potency: "639cv",
        max_speed: "315km/h"
      },

      itens: {
        airbag: true,
        alarm: true,
        leather_seat: true,
        cruise_control: true,
        abs: true,
        onBoard_computer: true
      },

      images: [
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788978364/mercedez1_taf7rh.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788978365/mercedez2_a9ngbh.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1788978365/mercedez3_ju4xjo.jpg"
      ]
    },
    {
      name: "Mercedes-Benz G-Class",
      model: "G 63 AMG",
      value: 1900000,
      categoryName: "SUV",
      brandName: "Mercedes-Benz",
      espec: { year: 2025, fuel: FuelType.Gasolina, color: "South Sea Blue", transmission: "Automático", engine: "4.0 V8 Biturbo", potency: "585cv", max_speed: "220km/h" },
      itens: { airbag: true, alarm: true, leather_seat: true, cruise_control: true, abs: true, onBoard_computer: true },
      images: ["https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776189623/2025-Mercedes-AMG-G63-007-1600_p1npxw.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776189590/2025-Mercedes-AMG-G63-005-1600_gji1et.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776189606/2025-Mercedes-AMG-G63-006-1600_emdw3s.jpg"
      ]
    },
    {
      name: "Mercedes-Benz S-Class",
      model: "S 680 Maybach",
      value: 3000000,
      categoryName: "Luxo",
      brandName: "Mercedes-Benz",
      espec: { year: 2021, fuel: FuelType.Gasolina, color: "Two-tone Silver/Black", transmission: "Automático", engine: "6.0 V12 Biturbo", potency: "612cv", max_speed: "250km/h" },
      itens: { airbag: true, alarm: true, leather_seat: true, cruise_control: true, abs: true, onBoard_computer: true },
      images: ["https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776189721/2021-Mercedes-Benz-S-Class-014-1600_esxwug.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776189726/2021-Mercedes-Benz-S-Class-015-1600_osmekf.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776189729/2021-Mercedes-Benz-S-Class-016-1600_mdj4rh.jpg"]
    }
  ];

  // 🔁 Loop para criar todos os carros
  for (const carro of carros) {
    const espec = await prisma.espec.create({
      data: carro.espec
    });

    const itens = await prisma.itens.create({
      data: carro.itens
    });

    const brand = await prisma.brand.findUnique({
      where: { name: carro.brandName }
    });

    const category = await prisma.category.findUnique({
      where: { name: carro.categoryName }
    });

    if (!brand) {
      throw new Error(`Marca não encontrada: ${carro.brandName}`);
    }

    if (!category) {
      throw new Error(`Categoria não encontrada: ${carro.categoryName}`);
    }

    await prisma.car.create({
      data: {
        name: carro.name,
        model: carro.model,
        value: new Prisma.Decimal(carro.value),

        brandId: brand.id,
        especId: espec.id,
        itensId: itens.id,
        categoryId: category.id,

        images: {
          create: carro.images.map((url) => ({ url }))
        }
      }
    });
  }
}

main()
  .then(() => {
    console.log("🌱 Seed finalizado");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });