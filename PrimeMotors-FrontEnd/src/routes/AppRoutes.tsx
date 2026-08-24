import { Route, Routes } from "react-router-dom";

import Menu from "../layout/Menu";
import { Home, Login, Register, ErrorPage, Explorar, Garagem } from "../pages";
import Favoritos from "../pages/Favoritos";
import ProdutoCard from "../pages/ProdutoCard";
import UserProfile from "../pages/UserProfile";
import TestDrive from "../pages/TestDrive";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<ErrorPage />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Menu" element={<Menu />} />
      <Route path="/Explorar" element={<Explorar />} />
      <Route path="/Explorar/:id" element={<ProdutoCard />} />
      <Route path="/Garagem/:id" element={<Garagem />} />
      <Route path="/Perfil/:id" element={<UserProfile />} />
      <Route path="/Favoritos/:id" element={<Favoritos/>} />
      <Route path="/TestDrive/:id" element={<TestDrive/>} />
    </Routes>
  );
}
