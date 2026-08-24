import { Link } from "react-router-dom";

import Logo from "../assets/icons/logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-white border-t border-zinc-800 py-12 px-6 p-3 ">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div>
            <p>Desenvolvedores</p>
            <p className="text-sm font-light tracking-widest uppercase">
              <span className="mx-1">Aitom Henrique Donatoni</span>
            </p>

            <p className="text-sm font-light tracking-widest uppercase">
              <span className="mx-1">Fernando Consolin Rosa</span>
            </p>
          </div>
          <div>
            <p>Redes Sociais </p>
            <p className="text-sm font-light tracking-widest uppercase">
              <i className="bi bi-instagram"></i>
              <span className="mx-1">
                <Link
                  to="https://www.instagram.com/aitomdonatoni/"
                  target="_blank" className="text-white"
                >
                  Aitom Henrique Donatoni
                </Link>
              </span>
            </p>
            <p className="text-sm font-light tracking-widest uppercase">
              <i className="bi bi-instagram"></i>
              <span className="mx-1 ">
                <Link
                  to="https://www.instagram.com/ferconsolin_rosa/"
                  target="_blank" className="text-white"
                >
                  Fernando Consolin Rosa
                </Link>
              </span>
            </p>
          </div>
          <div>
            <p>Github </p>
            <p className="text-sm font-light tracking-widest uppercase">
              <i className="bi bi-github"></i>
              <span className="mx-1">
                <Link to="https://github.com/AitomD" target="_blank" className="text-white">
                  Aitom Henrique Donatoni
                </Link>
              </span>
            </p>
            <p className="text-sm font-light tracking-widest uppercase">
              <i className="bi bi-github"></i>
              <span className="mx-1 ">
                <Link
                  to="https://github.com/FernandoConsolinRosa11"
                  target="_blank" className="text-white"
                >
                  Fernando Consolin Rosa
                </Link>
              </span>
            </p>
          </div>
        </div>
        <div className="text-center my-5">
          <p className="text-[10px] text-zinc-50 uppercase tracking-[0.1em]">
            © {new Date().getFullYear()} Todos os direitos reservados.
          </p>
        </div>
        <div className="justify-self-center ">
          <img src={Logo} alt="logo" className="size-40 w-full mt-2!" />
        </div>
      </div>
    </footer>
  );
}
