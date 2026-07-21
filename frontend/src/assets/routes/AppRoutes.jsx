//rutas d dónde se encuentran las vistas en las carpetas del proyecto
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../../pages/Login';
import DashboardDueno from '../../pages/DashboardDueno';
import DashboardEncargado from '../../pages/DashboardEncargado';
import PanelDueno from '../../pages/PanelDueno';
import PanelEncargado from '../../pages/PanelEncargado';
import NuevaVenta from '../../pages/NuevaVenta';
import GestionProductos from '../../pages/GestionProductos';
import AlertasCaducidad from '../../pages/AlertasCaducidad';
import ReabastecimientoInventario from '../../pages/ReabastecimientoInventario';
import GestionCatalogo from '../../pages/GestionCatalogo';
import HistorialVentasDueno from '../../pages/historialVentasDueno';
import AgregarProducto from '../../pages/AgregarProducto';
import Historico from '../../pages/Historico';
import Inventario from '../../pages/Inventario';
//import '../../Styles/variables.css';
import '../../Styles/reset.css';

//route path = cómo aparece en el buscador --- {nombre del archivo}
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardDueno />} />
        <Route path="/dashboard-encargado" element={<DashboardEncargado />} />
        <Route path="/panel" element={<PanelDueno />} />
        <Route path="/panel-encargado" element={<PanelEncargado />} />
        <Route path="/nueva-venta" element={<NuevaVenta />} />
        <Route path="/productos" element={<GestionProductos />} />
        <Route path="/alertas" element={<AlertasCaducidad />} />
        <Route path="/reabastecimiento" element={<ReabastecimientoInventario />} />
        <Route path="/catalogo" element={<GestionCatalogo />} />
        <Route path="/historial-ventas" element={<HistorialVentasDueno />} />
        <Route path="/agregar-producto" element={<AgregarProducto />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/inventario" element={<Inventario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;