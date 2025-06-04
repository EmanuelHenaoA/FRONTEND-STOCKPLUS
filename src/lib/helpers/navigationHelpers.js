// navigationHelpers.js
import { useNavigate } from "react-router-dom";

const useNavigationHelpers = () => {
  const navigate = useNavigate();

  const loginForm = () => {
    navigate("/login");
  };

  const registerForm = () => {
    navigate("/registro");
  }

  const landingPage = () => {
    navigate("/")
  }

  const rolesPage = () => {
    navigate("/roles")
  }

  const dashboardPage = () => {
    navigate("/dashboard")
  }

  const forgotPasswordPage = () => {
    navigate("/forgot-password")
  }

  const buysPage = () => {
    navigate("/compras")
  }

  const catalogPage = () => {
    navigate ("/catalogo")
  }

  const repuestosView = () => {
    navigate ("/repuestos-catalogo")
  }

  return { loginForm, registerForm, landingPage, rolesPage, dashboardPage, forgotPasswordPage, buysPage, catalogPage, repuestosView };
};

export default useNavigationHelpers;