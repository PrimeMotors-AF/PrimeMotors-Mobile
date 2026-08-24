import { PrismaClient, Prisma, FuelType } from "@prisma/client";
import process from "node:process";

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
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1774999662/lambo1_mi8aco.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1774999663/lambo2_jlbwpe.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1774999663/lambo3_gzsrfn.jpg"
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
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1774997221/Ferrari2_qzdkkx.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1774997225/Ferrari_l84qnw.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1774997221/Ferrari3_xcvtn7.jpg"
      ]
    },
    {
      name: "Ferrari F8 Tributo",
      model: "F8 Spider",
      value: 3500000,
      categoryName: "Super Esportivo",
      brandName: "Ferrari",
      espec: { year: 2023, fuel: FuelType.Gasolina, color: "Rosso Corsa", transmission: "Automático", engine: "3.9 V8 Biturbo", potency: "720cv", max_speed: "340km/h" },
      itens: { airbag: true, alarm: true, leather_seat: true, cruise_control: true, abs: true, onBoard_computer: true },
      images: ["https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776187485/2020-Ferrari-F8-Tributo-001-1600_f2bpcq.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776187495/2020-Ferrari-F8-Tributo-002-1600_nkexfy.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776187501/2020-Ferrari-F8-Tributo-003-1600_jdmay5.jpg"
      ]
    },
    {
      name: "Ferrari Purosangue",
      model: "V12 SUV",
      value: 6200000,
      categoryName: "SUV",
      brandName: "Ferrari",
      espec: { year: 2024, fuel: FuelType.Gasolina, color: "Grigio Titanio", transmission: "Automático", engine: "6.5 V12", potency: "725cv", max_speed: "310km/h" },
      itens: { airbag: true, alarm: true, leather_seat: true, cruise_control: true, abs: true, onBoard_computer: true },
      images: ["https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776187721/2023-Ferrari-Purosangue-001-1600_gyewvw.jpg", "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776187734/2023-Ferrari-Purosangue-003-1600_vnlvw8.jpg", "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776187728/2023-Ferrari-Purosangue-002-1600_n300gh.jpg"]
    },
    {
      name: "Ferrari SF90 Stradale",
      model: "Assetto Fiorano",
      value: 6900000,
      categoryName: "Super Esportivo",
      brandName: "Ferrari",
      espec: { year: 2024, fuel: FuelType.Hibrido, color: "Argento Nurburgring", transmission: "Automático", engine: "4.0 V8 Plug-in Hybrid", potency: "1000cv", max_speed: "340km/h" },
      itens: { airbag: true, alarm: true, leather_seat: true, cruise_control: true, abs: true, onBoard_computer: true },
      images: ["https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776187929/2024-Ferrari-SF90-XX-Stradale-001-1600_kxzgpg.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776187933/2024-Ferrari-SF90-XX-Stradale-002-1600_nqrwrd.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776187935/2024-Ferrari-SF90-XX-Stradale-004-1600_jleruk.jpg"
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
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775084333/porsche1_dnzaz5.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775084330/porsche2_yfxwas.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775084333/porsche3_uocgh3.jpg"
      ]
    },
    {
      name: "Porsche Taycan",
      model: "Taycan Turbo S",
      value: 1200000,
      categoryName: "Esportivo",
      brandName: "Porsche",
      espec: { year: 2025, fuel: FuelType.Eletrico, color: "Cross Turismo", transmission: "Automático", engine: "Elétrico (800V)", potency: "761cv", max_speed: "260km/h" },
      itens: { airbag: true, alarm: true, leather_seat: true, cruise_control: true, abs: true, onBoard_computer: true },
      images: ["https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776188379/2025-Porsche-Taycan-Turbo-Cross-Turismo-001-1600_gmjttc.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776188386/2025-Porsche-Taycan-Turbo-Cross-Turismo-002-1600_bppu3h.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776188394/2025-Porsche-Taycan-Turbo-Cross-Turismo-003-1600_snmaww.jpg"]
    },
    {
      name: "Porsche Cayenne",
      model: "Cayenne Turbo GT",
      value: 1350000,
      categoryName: "SUV",
      brandName: "Porsche",
      espec: { year: 2026, fuel: FuelType.Gasolina, color: "Arctic Grey", transmission: "Automático", engine: "4.0 V8 Biturbo", potency: "640cv", max_speed: "300km/h" },
      itens: { airbag: true, alarm: true, leather_seat: true, cruise_control: true, abs: true, onBoard_computer: true },
      images: ["https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776188599/2026-Porsche-Cayenne-Turbo-Electric-001-1600_vjaleb.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776188608/2026-Porsche-Cayenne-Turbo-Electric-002-1600_xfvmcq.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776188611/2026-Porsche-Cayenne-Turbo-Electric-007-1600_ascxnk.jpg"]
    },
    {
      name: "Porsche 718 Cayman",
      model: "GT4 RS",
      value: 1100000,
      categoryName: "Esportivo",
      brandName: "Porsche",
      espec: { year: 2017, fuel: FuelType.Gasolina, color: "Shark Blue", transmission: "Automático", engine: "4.0 Flat-6", potency: "500cv", max_speed: "315km/h" },
      itens: { airbag: true, alarm: true, leather_seat: true, cruise_control: true, abs: true, onBoard_computer: true },
      images: ["https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776188724/2017-Porsche-718-Cayman-001-1600_pto0ii.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776188729/2017-Porsche-718-Cayman-002-1600_mbtnfv.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776188731/2017-Porsche-718-Cayman-003-1600_axzx1b.jpg"]
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
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775084474/mclaren1_dwn0ze.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775084475/mclaren2_puyeqy.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775084475/mclaren3_f0lj0r.jpg"
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
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775084804/buggati1_dsbpbr.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775084804/buggati2_mvkecn.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775084804/buggati3_t87pe4.jpg"
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
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775085279/pagani1_fkqrgf.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775085279/pagani2_fljs3l.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775085279/pagani3_n3k5vb.jpg"
      ]
    },

    //Koenigsegg
    {
      name: "Koenigsegg Jesko",
      model: "Jesko Absolut",
      value: 25000000,
      categoryName: "Super Esportivo",
      brandName: "Koenigsegg",

      espec: {
        year: 2023,
        fuel: FuelType.Gasolina,
        color: "Azul pastel",
        transmission: "Automático",
        engine: "5.0 V8 Twin Turbo",
        potency: "1600cv",
        max_speed: "531km/h"
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
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775085459/Koenigsegg1_wocstc.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775085459/Koenigsegg2_eoy34k.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775085459/Koenigsegg3_xmvyuh.jpg"
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
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775085625/roll1_liqj8x.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775085626/roll2_pwgysp.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775085626/roll3_xkkjiu.jpg"
      ]
    },
    {
      name: "Rolls-Royce Cullinan",
      model: "Black Badge",
      value: 7000000,
      categoryName: "SUV",
      brandName: "Rolls-Royce",
      espec: { year: 2019, fuel: FuelType.Gasolina, color: "Magma Red", transmission: "Automático", engine: "6.75 V12", potency: "600cv", max_speed: "250km/h" },
      itens: { airbag: true, alarm: true, leather_seat: true, cruise_control: true, abs: true, onBoard_computer: true },
      images: ["https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776189093/2019-Rolls-Royce-Cullinan-007-1600_cngfuw.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776189114/2019-Rolls-Royce-Cullinan-008-1600_fkfx1y.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776189102/2019-Rolls-Royce-Cullinan-009-1600_jabtfb.jpg"
      ]
    },
    {
      name: "Rolls-Royce Ghost",
      model: "Extended Wheelbase",
      value: 5500000,
      categoryName: "Luxo",
      brandName: "Rolls-Royce",
      espec: { year: 2015, fuel: FuelType.Gasolina, color: "Wild Berry", transmission: "Automático", engine: "6.75 V12", potency: "571cv", max_speed: "250km/h" },
      itens: { airbag: true, alarm: true, leather_seat: true, cruise_control: true, abs: true, onBoard_computer: true },
      images: ["https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776189361/2015-Rolls-Royce-Ghost-V-Specification-001-1600_aw6q3u.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776189366/2015-Rolls-Royce-Ghost-V-Specification-002-1600_pwvj2b.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776189381/2015-Rolls-Royce-Ghost-V-Specification-003-1600_uorc2w.jpg"
      ]
    },
    {
      name: "Rolls-Royce Spectre",
      model: "Electric Coupe",
      value: 6500000,
      categoryName: "Luxo",
      brandName: "Rolls-Royce",
      espec: { year: 2024, fuel: FuelType.Eletrico, color: "Chartreuse", transmission: "Automático", engine: "Elétrico", potency: "584cv", max_speed: "250km/h" },
      itens: { airbag: true, alarm: true, leather_seat: true, cruise_control: true, abs: true, onBoard_computer: true },
      images: ["https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776189462/2024-Rolls-Royce-Spectre-001-1600_ft00za.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776189467/2024-Rolls-Royce-Spectre-002-1600_vrsrhf.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776189470/2024-Rolls-Royce-Spectre-003-1600_nrkfyu.jpg"]
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
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775085752/audi1_lf82ns.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775085752/audi2_ra2pqo.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775085752/audi3_sepk1t.jpg"
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
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775085846/bmw1_dorovm.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775085846/bmw2_f31kwj.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775085846/bmw3_mmwxb3.jpg"
      ]
    },
    {
      name: "BMW M5",
      model: "M5 CS",
      value: 1300000,
      categoryName: "Luxo",
      brandName: "BMW",
      espec: { year: 2025, fuel: FuelType.Gasolina, color: "Isle of Man Green", transmission: "Automático", engine: "4.4 V8 Biturbo", potency: "635cv", max_speed: "305km/h" },
      itens: { airbag: true, alarm: true, leather_seat: true, cruise_control: true, abs: true, onBoard_computer: true },
      images: ["https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776189874/2025-BMW-M5-001-1600_pvnec6.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776189885/2025-BMW-M5-003-1600_axbc8s.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776189880/2025-BMW-M5-002-1600_x7x1ix.jpg"
      ]
    },
    {
      name: "BMW XM",
      model: "Label Red",
      value: 2000000,
      categoryName: "SUV",
      brandName: "BMW",
      espec: { year: 2024, fuel: FuelType.Hibrido, color: "Frozen Carbon Black", transmission: "Automático", engine: "4.4 V8 Hybrid", potency: "748cv", max_speed: "290km/h" },
      itens: { airbag: true, alarm: true, leather_seat: true, cruise_control: true, abs: true, onBoard_computer: true },
      images: ["https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776190021/2024-BMW-XM-Label-Red-005-1600_xebdtf.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776190034/2024-BMW-XM-Label-Red-004-1600_v0bkyl.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776190041/2024-BMW-XM-Label-Red-002-1600_vikagx.jpg"]
    },
    {
      name: "BMW M3",
      model: "M3 Touring",
      value: 850000,
      categoryName: "Esportivo",
      brandName: "BMW",
      espec: { year: 2025, fuel: FuelType.Gasolina, color: "Portimao Blue", transmission: "Automático", engine: "3.0 Twin-Turbo", potency: "510cv", max_speed: "280km/h" },
      itens: { airbag: true, alarm: true, leather_seat: true, cruise_control: true, abs: true, onBoard_computer: true },
      images: ["https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776190155/2025-BMW-M3-Competition-001-1600_dyhdqf.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776190159/2025-BMW-M3-Competition-002-1600_mlhn8y.jpg",
        "https://res.cloudinary.com/ddnh19cgy/image/upload/q_auto/f_auto/v1776190165/2025-BMW-M3-Competition-003-1600_nljo0y.jpg"]
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
        color: "Verde militar",
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
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775085958/mercedez1_xfeqoh.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775085958/mercedez2_t5c9n5.jpg",
        "https://res.cloudinary.com/dchrzl7ao/image/upload/v1775085959/mercedez3_uedvhb.jpg"
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
    process.exit(1);
  });