import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import '../Styles/Pages/NuevaVenta.css';

// Aquí se llamará a productoService.js para traer el catálogo real
const CATALOGO_PRODUCTOS = [
  { id: 1, nombre: 'Leche Lala', precio: 29.0 },
  { id: 2, nombre: 'Café Orgánico 500g', precio: 52.99 },
  { id: 3, nombre: 'Queso Chédar', precio: 45.99 },
  { id: 4, nombre: 'Pasta Dental Crest', precio: 18.5 },
  { id: 5, nombre: 'Refresco Sprite', precio: 40.0 },
  { id: 6, nombre: 'Coca Cola', precio: 18.99 },
  { id: 7, nombre: 'Mouse Inalámbrico', precio: 199.0 },
];
//buscar productos y agregarlos al carrito, cambiar cantidades, eliminar productos, calcular total de venta y finalizar la venta
function NuevaVenta() {
  const [busqueda, setBusqueda] = useState('');
const [productoSeleccionado, setProductoSeleccionado] = useState(null);
const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [ventaFinalizada, setVentaFinalizada] = useState(false);

  // 2. Calcular el total de la venta automáticamente basado en el carrito
  const totalVenta = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);

  const handleCambiarCantidad = (id, incremento) => {
    setCarrito((prev) => 
      prev.map((item) => {
        if (item.id === id) {
          const nuevaCantidad = item.cantidad + incremento;
          // Evitamos que la cantidad baje de 1
          return { ...item, cantidad: Math.max(1, nuevaCantidad) };
        }
        return item;
      })
    );
  };

  const handleEliminarProducto = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCancelar = () => {
    setCarrito([]);
    setBusqueda('');
    setProductoSeleccionado(null);
  };

const sugerencias = useMemo(() => {
  if (!busqueda.trim()) return [];
  return CATALOGO_PRODUCTOS.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  ).slice(0, 6);
}, [busqueda]);

const handleSeleccionarSugerencia = (producto) => {
  setProductoSeleccionado(producto);
  setBusqueda(producto.nombre);
  setMostrarSugerencias(false);
};

const handleAgregarAlCarrito = () => {
  if (!productoSeleccionado) return;

  setCarrito((prev) => {
    const existente = prev.find((item) => item.id === productoSeleccionado.id);
    if (existente) {
      return prev.map((item) =>
        item.id === productoSeleccionado.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    }
    return [...prev, { ...productoSeleccionado, cantidad: 1 }];
  });

  setProductoSeleccionado(null);
  setBusqueda('');
};
  const handleFinalizarVenta = async () => {
    if (carrito.length === 0) return;

    try {
      // Aquí se llamará a ventaService.js
      // Ejemplo: await ventaService.registrarVenta({ items: carrito, total: totalVenta });

      setVentaFinalizada(true);
      setCarrito([]);
      setProductoSeleccionadoId('');

      setTimeout(() => setVentaFinalizada(false), 4000);
    } catch (err) {
      console.error('Error al procesar la venta:', err);
    }
  };

  //evito comentar lo obvio
  return (
    <Layout role="Encargado" title="Nueva Venta">
     <div className="venta-content">
       <div className="venta-actions-row">
       </div>
        {ventaFinalizada && (
          <div className="venta-success-banner">✓ Venta finalizada exitosamente</div>
        )}

        <section className="venta-body">
          <div className="venta-search-card">
            <label htmlFor="producto" className="venta-label">
              Buscar Producto
            </label>
            <div className="venta-select-wrapper">
              <div className="venta-autocomplete-wrapper">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="venta-select-icon">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
               </svg>
                <input
                type="text"
                id="producto"
                name="producto"
                className="venta-autocomplete-input"
                placeholder="Selecciona un producto..."
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setProductoSeleccionado(null);
                  setMostrarSugerencias(true);
                }}
                onFocus={() => setMostrarSugerencias(true)}
                onBlur={() => setTimeout(() => setMostrarSugerencias(false), 150)}
                autoComplete="off"
              />
              {mostrarSugerencias && sugerencias.length > 0 && (
                <ul className="venta-autocomplete-list">
                  {sugerencias.map((p) => (
                    <li
                      key={p.id}
                      className="venta-autocomplete-item"
                      onMouseDown={() => handleSeleccionarSugerencia(p)}
                    >
                      <span>{p.nombre}</span>
                      <span className="venta-autocomplete-price">${p.precio.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                  )}
              </div>

             <button className="venta-add-button" onClick={handleAgregarAlCarrito}>
              Agregar al Carrito
              </button>
            </div>
          </div>
          <div className="venta-cart-column">
            <div className="venta-cart-card">
              <h2 className="venta-cart-title">Carrito de Compra</h2>

              {carrito.length === 0 ? (
                <div className="venta-cart-empty">
                  <p className="venta-cart-empty-title">El carrito está vacío</p>
                  <p className="venta-cart-empty-subtitle">
                    Agrega productos para comenzar una venta
                  </p>
                </div>
              ) : (
                <div className="venta-cart-list">
                  {carrito.map((item) => (
                    <div className="venta-cart-item" key={item.id}>
                      <div className="venta-cart-item-info">
                        <p className="venta-cart-item-name">{item.nombre}</p>
                        <p className="venta-cart-item-price">${item.precio.toFixed(2)} c/u</p>
                      </div>
                      <div className="venta-cart-item-controls">
                        <button
                          className="venta-qty-button"
                          onClick={() => handleCambiarCantidad(item.id, -1)}
                          aria-label="Disminuir cantidad"
                        >
                          −
                        </button>
                        <span className="venta-qty-value">{item.cantidad}</span>
                        <button
                          className="venta-qty-button"
                          onClick={() => handleCambiarCantidad(item.id, 1)}
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                        <span className="venta-item-subtotal">
                          ${(item.precio * item.cantidad).toFixed(2)}
                        </span>
                        <button
                          className="venta-remove-button"
                          onClick={() => handleEliminarProducto(item.id)}
                          aria-label="Eliminar producto"
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="venta-summary-card">
              <div className="venta-total-row">
                <span className="venta-total-label">Total de Venta:</span>
                <span className="venta-total-value">${totalVenta.toFixed(2)}</span>
              </div>
              <div className="venta-actions-row">
                <button className="venta-cancel-button" onClick={handleCancelar}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  Cancelar
                </button>
                <button
                  className="venta-finish-button"
                  onClick={handleFinalizarVenta}
                  disabled={carrito.length === 0}
                >
                  Finalizar Venta
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default NuevaVenta;