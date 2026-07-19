import { useState, useMemo } from 'react';
import NavBar from '../components/NavBar';
import '../styles/pages/GestionProductos.css';

// Aquí se llamará a productoService.js para traer el listado real
const PRODUCTOS_INICIALES = [
  { id: 1, nombre: 'Leche Lala', categoria: 'Lácteos', precio: 29.0, stock: 15, estado: 'Activo' },
  { id: 2, nombre: 'Mouse Inalámbrico', categoria: 'Electrónica', precio: 225.5, stock: 3, estado: 'Activo' },
  { id: 3, nombre: 'Pasta Dental Crest', categoria: 'Higiene personal', precio: 35.0, stock: 25, estado: 'Activo' },
  { id: 4, nombre: 'Queso Chédar', categoria: 'Lácteos', precio: 45.99, stock: 18, estado: 'Activo' },
  { id: 5, nombre: 'Café Orgánico 500g', categoria: 'Alimentos', precio: 52.99, stock: 5, estado: 'Activo' },
  { id: 6, nombre: 'Té Verde', categoria: 'Alimentos', precio: 8.5, stock: 30, estado: 'Activo' },
  { id: 7, nombre: 'Lámpara LED', categoria: 'Hogar', precio: 72.0, stock: 12, estado: 'Activo' },
  { id: 8, nombre: 'Salchicha Food', categoria: 'Alimentos', precio: 34.99, stock: 0, estado: 'Inactivo' },
  { id: 9, nombre: 'Cepillo Dental', categoria: 'Higiene personal', precio: 29.99, stock: 2, estado: 'Activo' },
  { id: 10, nombre: 'Nissi', categoria: 'Alimentos', precio: 15.0, stock: 8, estado: 'Activo' },
  { id: 11, nombre: 'Refresco Sprite', categoria: 'Bebidas', precio: 40.0, stock: 20, estado: 'Activo' },
  { id: 12, nombre: 'Coca Cola', categoria: 'Bebidas', precio: 51.99, stock: 0, estado: 'Descontinuado' },
];

const ESTADOS = ['Activo', 'Inactivo', 'Deshabilitado', 'Descontinuado'];
const UMBRAL_STOCK_BAJO = 5;
//todo lo de arriba (la busqueda, los filtros y el furmulario)
function GestionProductos() {
  const [productos, setProductos] = useState(PRODUCTOS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');

  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formulario, setFormulario] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    stock: '',
    estado: 'Activo',
  });

  const categorias = useMemo(
    () => [...new Set(productos.map((p) => p.categoria))].sort(),
    [productos]
  );

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const coincideBusqueda =
        !busqueda.trim() ||
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        String(p.id).includes(busqueda);
      const coincideCategoria = !categoriaFiltro || p.categoria === categoriaFiltro;
      const coincideEstado = !estadoFiltro || p.estado === estadoFiltro;
      return coincideBusqueda && coincideCategoria && coincideEstado;
    });
  }, [productos, busqueda, categoriaFiltro, estadoFiltro]);

  const handleAbrirNuevo = () => {
    setProductoEditando(null);
    setFormulario({ nombre: '', categoria: '', precio: '', stock: '', estado: 'Activo' });
    setMostrarModal(true);
  };

  const handleAbrirEditar = (producto) => {
    setProductoEditando(producto);
    setFormulario({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      stock: producto.stock,
      estado: producto.estado,
    });
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setProductoEditando(null);
  };

  const handleChangeFormulario = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    if (!formulario.nombre.trim() || !formulario.categoria.trim()) return;

    const datosProducto = {
      nombre: formulario.nombre.trim(),
      categoria: formulario.categoria.trim(),
      precio: Number(formulario.precio) || 0,
      stock: Number(formulario.stock) || 0,
      estado: formulario.estado,
    };

    try {
      if (productoEditando) {
        // Aquí se llamará a productoService.js
        // Ejemplo: await productoService.actualizar(productoEditando.id, datosProducto);
        setProductos((prev) =>
          prev.map((p) => (p.id === productoEditando.id ? { ...p, ...datosProducto } : p))
        );
      } else {
        // Aquí se llamará a productoService.js
        // Ejemplo: const nuevo = await productoService.crear(datosProducto);
        const nuevoId = Math.max(...productos.map((p) => p.id), 0) + 1;
        setProductos((prev) => [...prev, { id: nuevoId, ...datosProducto }]);
      }
      handleCerrarModal();
    } catch (err) {
      console.error('Error al guardar el producto:', err);
    }
  };

  const handleEliminar = async (id) => {
    // Aquí se llamará a productoService.js
    // Ejemplo: await productoService.eliminar(id);
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };
  
////////////////////////////////
  return (
    <div className="productos-container">
       <NavBar role="Encargado" />

      <main className="productos-content">
        <header className="productos-header">
          <h1 className="productos-title">Gestión de Productos</h1>
          <p className="productos-subtitle">Listado e Inventario</p>
        </header>

        <section className="productos-toolbar">
          <div className="productos-search-wrapper">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" className="productos-search-icon">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="productos-search-input"
              placeholder="Buscar por nombre o ID..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <select
            className="productos-filter-select"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="productos-filter-select"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="">Todos los estados</option>
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>

          <button className="productos-new-button" onClick={handleAbrirNuevo}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nuevo Producto
          </button>
        </section>

        <section className="productos-table-wrapper">
          <table className="productos-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock Actual</th>
                <th>Estado</th>
                <th className="productos-th-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((p) => {
                const stockBajo = p.stock <= UMBRAL_STOCK_BAJO;
                return (
                  <tr key={p.id} className={stockBajo ? 'productos-row-bajo-stock' : ''}>
                    <td>{p.id}</td>
                    <td className="productos-cell-nombre">
                      {p.nombre}
                      {stockBajo && (
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#d08700" strokeWidth="2">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
                        </svg>
                      )}
                    </td>
                    <td>{p.categoria}</td>
                    <td>${p.precio.toFixed(2)}</td>
                    <td className={stockBajo ? 'productos-stock-bajo' : 'productos-stock-normal'}>
                      {p.stock}
                    </td>
                    <td>
                      <span className={`productos-badge productos-badge-${p.estado.toLowerCase()}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="productos-td-acciones">
                      <button
                        className="productos-action-button"
                        onClick={() => handleAbrirEditar(p)}
                        aria-label="Editar producto"
                      >
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        className="productos-action-button productos-action-danger"
                        onClick={() => handleEliminar(p.id)}
                        aria-label="Eliminar producto"
                      >
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </main>

      {mostrarModal && (
        <div className="productos-modal-overlay" onClick={handleCerrarModal}>
          <div className="productos-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="productos-modal-title">
              {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>

            <div className="productos-modal-form">
              <div className="productos-form-field">
                <label className="productos-form-label" htmlFor="nombre">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="productos-form-input"
                  value={formulario.nombre}
                  onChange={handleChangeFormulario}
                />
              </div>

              <div className="productos-form-field">
                <label className="productos-form-label" htmlFor="categoria">
                  Categoría
                </label>
                <input
                  type="text"
                  id="categoria"
                  name="categoria"
                  className="productos-form-input"
                  value={formulario.categoria}
                  onChange={handleChangeFormulario}
                />
              </div>

              <div className="productos-form-row">
                <div className="productos-form-field">
                  <label className="productos-form-label" htmlFor="precio">
                    Precio
                  </label>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    step="0.01"
                    className="productos-form-input"
                    value={formulario.precio}
                    onChange={handleChangeFormulario}
                  />
                </div>
                <div className="productos-form-field">
                  <label className="productos-form-label" htmlFor="stock">
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    className="productos-form-input"
                    value={formulario.stock}
                    onChange={handleChangeFormulario}
                  />
                </div>
              </div>

              <div className="productos-form-field">
                <label className="productos-form-label" htmlFor="estado">
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  className="productos-form-input"
                  value={formulario.estado}
                  onChange={handleChangeFormulario}
                >
                  {ESTADOS.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="productos-modal-actions">
              <button className="productos-modal-cancel" onClick={handleCerrarModal}>
                Cancelar
              </button>
              <button className="productos-modal-save" onClick={handleGuardar}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionProductos;