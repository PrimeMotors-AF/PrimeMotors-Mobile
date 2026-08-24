import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Notification from "../../components/Notification";
import { AuthContext } from "../../contexts/authContext";
import api from "../../services/api";
import type { CardCarProps } from "../../types/types";
import { Button } from "../UserProfile/Components";
import ProposalModal from "./components/proposalModal";
import SpecDescription from "./components/specDescription";
import TestDriveModal from "./components/testDriveModal";

export default function ProdutoCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Estados do Componente
  const [carro, setCarro] = useState<CardCarProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgSelecionada, setImgSelecionada] = useState("");
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false);

  // Estados para evitar erros de referência
  const [notification, setNotification] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  useEffect(() => {
    async function fetchCarro() {
      try {
        const res = await api.get(`/cars/${id}`);
        const data = res.data;
        setCarro(data);
        if (data.allImages && data.allImages.length > 0) {
          setImgSelecionada(data.allImages[0]);
        }
      } catch (err) {
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchCarro();
  }, [id]);

  // Timer para fechar notificação automaticamente
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 3200);
    return () => clearTimeout(timer);
  }, [notification]);

  if (loading)
    return (
      <div className="h-screen bg-[#121212] flex items-center justify-center text-white">
        Carregando...
      </div>
    );

  if (!carro)
    return (
      <div className="h-screen bg-[#121212] flex items-center justify-center text-white">
        Carro não encontrado.
      </div>
    );

  return (
    <div className="bg-[#121212] min-h-screen">
      {notification && (
        <Notification
          message={notification.message}
          variant={notification.variant}
          onClose={() => setNotification(null)}
        />
      )}

      <main className="mx-auto max-w-7xl p-4 md:p-8">
        {/* Card Superior Principal */}
        <div className="bg-white rounded-t-sm shadow-sm border border-gray-200 overflow-hidden p-4! md:p-6">
          {/* Botão Voltar */}
          <div className="mb-4">
            <Button
              className="hover:text-white text-2xl! transition-colors"
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left-square"></i>
            </Button>
          </div>

          {/* Layout de 3 Colunas: Miniaturas | Imagem | Info */}
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* 1. Miniaturas (Lateral Esquerda) */}
            <div className="w-full md:w-20 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[450px] scrollbar-hide">
              {carro.allImages?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setImgSelecionada(img)}
                  className={`shrink-0 w-16 h-16 border rounded p-0.5 transition ${
                    imgSelecionada === img
                      ? "border-[#C59958] border-2"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>

            {/* 2. Imagem Principal (Centro) */}
            <div className="grow bg-gray-50 rounded-lg flex items-center justify-center p-4 min-h-[300px] md:min-h-[450px] border border-gray-100">
              <img
                src={imgSelecionada}
                alt={carro.name}
                className="max-w-full max-h-[400px] object-contain drop-shadow-sm"
              />
            </div>

            {/* 3. Informações e Compra (Direita) */}
            <div className="w-full md:w-[380px] flex flex-col">
              <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-2">
                <span className="text-[#C59958]">{carro.name}</span>
              </h1>

              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6 pb-4 border-b border-gray-100">
                {carro.specs?.engine} • {carro.specs?.fuel} •{" "}
                {carro.specs?.transmission}
              </p>

              <div className="mb-8">
                <p className="text-sm font-medium text-gray-500">
                  Preço à vista
                </p>
                <p className="text-5xl font-black text-gray-950 tracking-tighter">
                  <span className="text-2xl font-bold align-top">R$</span>{" "}
                  {carro.price.toLocaleString("pt-BR")}
                </p>
              </div>

              {/* Grid de Atributos Rápidos */}
              <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                <div>
                  <p className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                    <i className="bi bi-geo-alt-fill"></i> Cidade
                  </p>
                  <p className="font-bold text-gray-900">São Paulo - SP</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                    <i className="bi bi-calendar2-week"></i> Ano
                  </p>
                  <p className="font-bold text-gray-900">{carro.year}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                    <i className="bi bi-h-circle"></i> Câmbio
                  </p>
                  <p className="font-bold text-gray-900">
                    {carro.specs?.transmission}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                    <i className="bi bi-car-front-fill"></i> Modelo
                  </p>
                  <p className="font-bold text-gray-900">{carro.model}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-auto">
                <Button
                  texto="Iniciar Proposta"
                  className="w-full bg-[#C59958] hover:bg-[#a67f47]! text-white font-bold py-4 rounded-lg transition uppercase tracking-wider text-sm flex items-center justify-center"
                  onClick={() => {
                    if (!user?.id) {
                      navigate("/Login");
                      return;
                    }
                    setIsModalOpen(true);
                  }}
                />

                <Button
                  className="w-full bg-transparent hover:bg-gray-100! text-gray-900 font-bold py-3.5 rounded-lg transition uppercase tracking-wider text-xs border border-gray-300 flex items-center justify-center gap-2"
                  onClick={() => {
                    if (!user?.id) {
                      navigate("/Login");
                      return;
                    }
                    setIsTestDriveModalOpen(true);
                  }}
                >
                  <i className="bi bi-calendar-check"></i> Agendar Test Drive
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Seção Inferior: Especificações Técnicas */}
        <div className="bg-white rounded-b-sm shadow-sm border border-gray-200 p-6! md:p-8">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-100 pb-4">
            Recursos e Itens do Veículo
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-10 text-gray-950 mb-10">
            <SpecDescription titulo="Motorização" valor={carro.specs?.engine} />
            <SpecDescription
              titulo="Transmissão"
              valor={carro.specs?.transmission}
            />
            <SpecDescription titulo="Potência" valor={carro.specs?.potency} />
            <SpecDescription
              titulo="Velocidade Máxima"
              valor={carro.specs?.max_speed}
            />
            <SpecDescription titulo="Cor" valor={carro.specs?.color} />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-100 ">
              Itens de Série
            </h3>
            <div className="flex flex-wrap gap-2">
              {carro?.features &&
              Array.isArray(carro.features) &&
              carro.features.length > 0 ? (
                carro.features.map(
                  (item: string | { name: string }, index: number) => (
                    <span
                      key={index}
                      className="text-[15px] text-white bg-[#C59958] px-3 my-3 rounded-full uppercase tracking-tighter"
                    >
                      {typeof item === "object" ? item.name : item}
                    </span>
                  ),
                )
              ) : (
                <p className="text-xs text-gray-400">Dados não disponíveis</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modais */}
      {isModalOpen && (
        <ProposalModal
          carId={id as string}
          isOpen={isModalOpen}
          userId={user?.id ?? ""}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isTestDriveModalOpen && (
        <TestDriveModal
          isOpen={isTestDriveModalOpen}
          carId={id as string}
          userId={user?.id ?? ""}
          onClose={() => setIsTestDriveModalOpen(false)}
          onSuccess={(msg: string) => {
            setNotification({ message: msg, variant: "success" });
          }}
          onError={(msg: string) => {
            setNotification({ message: msg, variant: "error" });
          }}
        />
      )}
    </div>
  );
}
