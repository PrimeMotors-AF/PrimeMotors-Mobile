import { useNavigate } from "react-router-dom";

import Button from "../../components/Button.tsx";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#121212] text-white py-20! text-center min-h-screen flex flex-col items-center justify-center">
      <div className="scale-150">
        <div className="text-4xl my-3 text-[#C59958]!">Erro 404</div>
        <div className="my-3">
          A pagina que está procurando não existe!
        </div>
        <Button
          texto=" ← Retornar"
          onClick={() => {
            navigate('/');
          }}
        />
      </div>
    </div>
  );
}
