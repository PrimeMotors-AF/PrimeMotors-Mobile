import { useContext } from "react";
import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

import { AuthContext } from "../contexts/authContext";
import "./menu.css";

export default function Menu() {
  const { user } = useContext(AuthContext);
  const garageLink = user ? `/Garagem/${user.id}` : "/Login";
  const favoriteLink = user ? `/Favoritos/${user.id}` : "/Login";
  const testDrivelink = user ? `/TestDrive/${user.id}` : "/login";
  return (
    <div className="h-[25vh] bg-fundo w-full relative z-40 left-0 top-full  border-t  border-zinc-800">
      <div className="container mx-auto px-6 h-[20vh] ">
        <div className="grid grid-cols-3  gap-5 py-4 w-full content-center!  h-full   ">
          <Link
            to={"/Explorar"}
            className="flex justify-between items-center animation me-4 border-b-2 p-1 no-underline"
          >
            <span>Explorar</span>
            <FaChevronRight />
          </Link>

          <Link
            to={garageLink}
            className="flex justify-between items-center animation me-4 border-b-2 p-1"
          >
            <span>Garagem</span>
            <FaChevronRight />
          </Link>

          <Link
            to={favoriteLink}
            className="flex justify-between items-center animation me-4 border-b-2 p-1"
          >
            <span>Favoritos</span>
            <FaChevronRight />
          </Link>
          <Link
            to={testDrivelink}
            className="flex justify-between items-center animation me-4 border-b-2 p-1"
          >
            <span>Teste Drive</span>
            <FaChevronRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
