import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { LoginForm } from "./pages/LoginForm";
import { RegisterForm } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import {UsersPage} from "./pages/UsersPage"
import {SalesPage} from "./pages/SalesPage"
import { ForgotPasswordForm } from "./pages/ForgotPasswordForm";
import { ResetPasswordForm } from "./pages/ResetPasswordForm";
import RolesPage from "./pages/RolesPage";
import RepuestosPage from "./pages/RepuestosPage";
import BuysPage from "./pages/BuysPage";
import ClientsPage from "./pages/ClientsPage";
import ProvidersPage from "./pages/ProvidersPage";
import CategoriesPage from "./pages/CategoriesPage";
import BrandsPage from "./pages/BrandsPage";
import PermissionsPage from "./pages/PermissionsPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/registro" element={<RegisterForm />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/usuarios" element={<UsersPage />} />
        <Route path="/clientes" element={<ClientsPage />} />
        <Route path="/proveedores" element={<ProvidersPage />} />
        <Route path="/compras" element={<BuysPage />} />
        <Route path="/categorias" element={<CategoriesPage />} />
        <Route path="/ventas" element={<SalesPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
        <Route path="/repuestos" element={<RepuestosPage />} />
        <Route path="/marcas" element={<BrandsPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/permisos" element={<PermissionsPage />} />
      </Routes>
    </Router>
  );
};

export default App;