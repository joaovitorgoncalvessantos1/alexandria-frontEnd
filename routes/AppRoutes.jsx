import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "../pages/Home/Home";
import Catalogo from "../pages/Catalogo/Catalogo";
import Emprestimos from "../pages/Emprestimos/emprestimos";
import Historico from "../pages/Historico/Historico";
import Detalhes from "../pages/Detalhes/Detalhes";
import DetalhesEmprestimos from "../components/DetalhesEmprestimos/DetalhesEmprestimos";
import Login from "../pages/Login/Login";
import Cadastro from "../pages/Cadastro/Cadastro";

function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/catalogo"
          element={<Catalogo />}
        />

        <Route
          path="/catalogo/:id"
          element={<Detalhes />}
        />
        <Route
          path="/livros/:id"
          element={<Detalhes />}
        />

        <Route
          path="/emprestimos"
          element={<Emprestimos />}
        />
        <Route
          path="/emprestimos/:id"
          element={<DetalhesEmprestimos />}
        />

        <Route
          path="/historico"
          element={<Historico />}
        />
        <Route
          path="/home"
          element={<Home />}
        />
        <Route
          path="/cadastro"
          element={<Cadastro/>}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;