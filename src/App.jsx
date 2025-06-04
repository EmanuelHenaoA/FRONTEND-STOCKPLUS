  import React from "react";
  import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
  import { ProtectedRoute, PermissionRoute } from "./components/ProtectedRoutes";
  import { LoginForm } from "./pages/LoginForm";
  import { RegisterForm } from "./pages/Register";
  import { Dashboard } from "./pages/Dashboard";
  import { UsersPage } from "./pages/UsersPage";
  import { SalesPage } from "./pages/SalesPage";
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
  import Unauthorized from "./components/Unauthorized";
  import Home from "./pages/Home";
  import CatalogoPage from "./pages/CatalogoPage"
  import RepuestosViewPage from "./pages/RepuestosViewPage";

  const App = () => {
    return (
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
          <Route path="/registro" element={<RegisterForm />} />
          <Route path="/catalogo" element={<CatalogoPage />} />

          {/* Rutas protegidas - necesitan autenticación */}
          <Route element={<ProtectedRoute />}>
            {/* Página de Dashboard - accesible para todos los usuarios autenticados */}
            <Route path="/dashboard" element={<Dashboard />} />

             <Route path="/repuestos-catalogo" element={<RepuestosViewPage />} />

            {/* Rutas que requieren permisos específicos */}
            <Route element={<PermissionRoute permiso="verUsuario" />}>
              <Route path="/usuarios" element={<UsersPage />} />
            </Route>

            <Route element={<PermissionRoute permiso="verCliente" />}>
              <Route path="/clientes" element={<ClientsPage />} />
            </Route>

            <Route element={<PermissionRoute permiso="verVenta" />}>
              <Route path="/ventas" element={<SalesPage />} />
            </Route>

            <Route element={<PermissionRoute permiso="verProveedor" />}>
              <Route path="/proveedores" element={<ProvidersPage />} />
            </Route>

            <Route element={<PermissionRoute permiso="verCompra" />}>
              <Route path="/compras" element={<BuysPage />} />
            </Route>

            <Route element={<PermissionRoute permiso="verCategoria" />}>
              <Route path="/categorias" element={<CategoriesPage />} />
            </Route>

            <Route element={<PermissionRoute permiso="verMarca" />}>
              <Route path="/marcas" element={<BrandsPage />} />
            </Route>

            <Route element={<PermissionRoute permiso="verRepuesto" />}>
              <Route path="/repuestos" element={<RepuestosPage />} />
            </Route>

            {/* Configuración */}
            <Route element={<PermissionRoute permiso="verRol" />}>
              <Route path="/roles" element={<RolesPage />} />
            </Route>

            <Route element={<PermissionRoute permiso="verPermiso" />}>
              <Route path="/permisos" element={<PermissionsPage />} />
            </Route>
          </Route>

          {/* Ruta para cualquier otra dirección - redirigir a login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  };

  export default App;