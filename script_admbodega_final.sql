
-- SCRIPT FINAL DE BASE DE DATOS: ADMBODEGA
-- Arquitectura Relacional Consolidada

-- 1. CATÁLOGOS INDEPENDIENTES (Sin dependencias)
CREATE TABLE rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE permiso (
    id_permiso INT AUTO_INCREMENT PRIMARY KEY,
    nombre_permiso VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(150)
);

CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE proveedor (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre_empresa VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    correo_contacto VARCHAR(100)
);

CREATE TABLE ubicacion (
    id_ubicacion INT AUTO_INCREMENT PRIMARY KEY,
    pasillo VARCHAR(10),
    anaquel VARCHAR(10),
    descripcion VARCHAR(100)
);

CREATE TABLE unidad_medida (
    id_unidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_unidad VARCHAR(50) NOT NULL UNIQUE,
    abreviatura VARCHAR(10) NOT NULL
);

CREATE TABLE motivo_merma (
    id_motivo INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL UNIQUE
);

-- 2. TABLAS DE SEGURIDAD Y USUARIOS
CREATE TABLE rol_permiso (
    id_rol INT NOT NULL,
    id_permiso INT NOT NULL,
    PRIMARY KEY (id_rol, id_permiso),
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE CASCADE,
    FOREIGN KEY (id_permiso) REFERENCES permiso(id_permiso) ON DELETE CASCADE
);

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    estado TINYINT DEFAULT 1,
    id_rol INT,
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);

CREATE TABLE historial_sesion (
    id_sesion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    token_generado VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE auditoria_sistema (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    accion_realizada VARCHAR(255) NOT NULL,
    tabla_afectada VARCHAR(50),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- 3. TABLAS DE INVENTARIO Y ALMACENAMIENTO
CREATE TABLE producto (
    codigo_barras VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio_compra DECIMAL(10,2) NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    stock_actual INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL,
    id_categoria INT,
    id_proveedor INT,
    id_ubicacion INT,
    id_unidad INT,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
    FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor),
    FOREIGN KEY (id_ubicacion) REFERENCES ubicacion(id_ubicacion),
    FOREIGN KEY (id_unidad) REFERENCES unidad_medida(id_unidad)
);

CREATE TABLE lote_producto (
    id_lote INT AUTO_INCREMENT PRIMARY KEY,
    codigo_barras VARCHAR(20) NOT NULL,
    numero_lote VARCHAR(50) NOT NULL,
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento DATE NOT NULL,
    cantidad_inicial INT NOT NULL,
    stock_restante INT NOT NULL,
    FOREIGN KEY (codigo_barras) REFERENCES producto(codigo_barras) ON DELETE CASCADE
);

CREATE TABLE alerta_inventario (
    id_alerta INT AUTO_INCREMENT PRIMARY KEY,
    codigo_barras VARCHAR(20) NOT NULL,
    tipo_alerta ENUM('Desabasto', 'Caducidad') NOT NULL,
    mensaje_alerta VARCHAR(255) NOT NULL,
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Pendiente', 'Resuelta') DEFAULT 'Pendiente',
    FOREIGN KEY (codigo_barras) REFERENCES producto(codigo_barras)
);

-- 4. TABLAS OPERATIVAS (VENTAS, MERMAS Y MOVIMIENTOS)
CREATE TABLE venta (
    folio_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_cobrado DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE detalle_venta (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    folio_venta INT NOT NULL,
    codigo_barras VARCHAR(20) NOT NULL,
    cantidad INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (folio_venta) REFERENCES venta(folio_venta) ON DELETE CASCADE,
    FOREIGN KEY (codigo_barras) REFERENCES producto(codigo_barras)
);

CREATE TABLE merma (
    id_merma INT AUTO_INCREMENT PRIMARY KEY,
    codigo_barras VARCHAR(20) NOT NULL,
    id_usuario INT NOT NULL,
    id_motivo INT,
    cantidad_baja INT NOT NULL,
    subtotal_perdido DECIMAL(10,2) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (codigo_barras) REFERENCES producto(codigo_barras),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_motivo) REFERENCES motivo_merma(id_motivo)
);

CREATE TABLE movimiento_inventario (
    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    codigo_barras VARCHAR(20) NOT NULL,
    id_usuario INT NOT NULL,
    tipo_movimiento ENUM('Entrada', 'Salida') NOT NULL,
    cantidad INT NOT NULL,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (codigo_barras) REFERENCES producto(codigo_barras),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);