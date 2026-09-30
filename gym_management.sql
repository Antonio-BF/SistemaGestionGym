-- ==============================================================================
-- GYM MANAGEMENT SYSTEM 
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS gym_management
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE gym_management;

-- ==============================================================================
-- 1. ROLES Y USUARIOS
-- ==============================================================================

CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_rol INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    genero ENUM('MASCULINO', 'FEMENINO', 'OTRO', 'PREFIERO_NO_DECIR') DEFAULT 'PREFIERO_NO_DECIR',
    fecha_nacimiento DATE,
    fecha_ultimo_acceso DATETIME,        
    estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE RESTRICT
);

-- ==============================================================================
-- 2. MEMBRESÍAS Y PLANES
-- ==============================================================================

CREATE TABLE planes_membresia (
    id_plan INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    dias_duracion INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
    CONSTRAINT chk_dias CHECK (dias_duracion > 0),
    CONSTRAINT chk_precio CHECK (precio >= 0)
);

CREATE TABLE membresias_cliente (
    id_membresia INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_plan INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    monto_pagado DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('EFECTIVO', 'TARJETA_CREDITO', 'TARJETA_DEBITO', 'TRANSFERENCIA') NOT NULL,
    renovacion_automatica BOOLEAN DEFAULT FALSE,
    estado_membresia ENUM('ACTIVA', 'VENCIDA', 'CONGELADA', 'ANULADA') DEFAULT 'ACTIVA',
    fecha_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_membresia_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    CONSTRAINT fk_membresia_plan FOREIGN KEY (id_plan) REFERENCES planes_membresia(id_plan) ON DELETE RESTRICT,
    CONSTRAINT chk_fechas_membresia CHECK (fecha_fin >= fecha_inicio)
);

-- ==============================================================================
-- 3. CLASES Y RESERVAS
-- ==============================================================================

CREATE TABLE disciplinas (
    id_disciplina INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    capacidad_base INT NOT NULL,
    CONSTRAINT chk_capacidad CHECK (capacidad_base > 0)
);

CREATE TABLE clases_programadas (
    id_clase INT AUTO_INCREMENT PRIMARY KEY,
    id_disciplina INT NOT NULL,
    id_instructor INT NOT NULL,          
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    capacidad_maxima INT NOT NULL,
    cupos_reservados INT DEFAULT 0,
    estado ENUM('PROGRAMADA', 'EN_CURSO', 'FINALIZADA', 'CANCELADA') DEFAULT 'PROGRAMADA',
    CONSTRAINT fk_clase_disciplina FOREIGN KEY (id_disciplina) REFERENCES disciplinas(id_disciplina) ON DELETE RESTRICT,
    CONSTRAINT fk_clase_instructor FOREIGN KEY (id_instructor) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    CONSTRAINT chk_horario_clase CHECK (hora_fin > hora_inicio),
    CONSTRAINT chk_cupos CHECK (cupos_reservados >= 0 AND cupos_reservados <= capacidad_maxima)
);

CREATE TABLE reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_clase INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_reserva DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado_reserva ENUM('RESERVADA', 'ASISTIO', 'CANCELADA') DEFAULT 'RESERVADA',
    CONSTRAINT fk_reserva_clase FOREIGN KEY (id_clase) REFERENCES clases_programadas(id_clase) ON DELETE RESTRICT,
    CONSTRAINT fk_reserva_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    CONSTRAINT uk_reserva_unica UNIQUE (id_clase, id_usuario)
);

CREATE TABLE asistencias (
    id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_hora_entrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_hora_salida DATETIME,
    CONSTRAINT fk_asistencia_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
);

-- ==============================================================================
-- 4. PRODUCTOS Y PUNTO DE VENTA (POS)
-- ==============================================================================

CREATE TABLE categorias_producto (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO'
);

CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    codigo_barras VARCHAR(50) UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    costo_compra DECIMAL(10,2) NOT NULL,  
    stock_actual INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 5,   
    estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
    CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES categorias_producto(id_categoria) ON DELETE RESTRICT,
    CONSTRAINT chk_precio_venta CHECK (precio_venta >= 0),
    CONSTRAINT chk_costo_compra CHECK (costo_compra >= 0),
    CONSTRAINT chk_stock_actual CHECK (stock_actual >= 0),
    CONSTRAINT chk_stock_minimo CHECK (stock_minimo >= 0)
);

CREATE TABLE ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_cliente INT,
    id_usuario_vendedor INT NOT NULL,
    fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_venta DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('EFECTIVO', 'TARJETA_CREDITO', 'TARJETA_DEBITO', 'YAPE_PLIN') NOT NULL,
    CONSTRAINT fk_venta_cliente FOREIGN KEY (id_usuario_cliente) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    CONSTRAINT fk_venta_vendedor FOREIGN KEY (id_usuario_vendedor) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    CONSTRAINT chk_total_venta CHECK (total_venta >= 0)
);

CREATE TABLE detalles_venta (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_detalle_venta FOREIGN KEY (id_venta) REFERENCES ventas(id_venta) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE RESTRICT,
    CONSTRAINT chk_cantidad_venta CHECK (cantidad > 0),
    CONSTRAINT chk_subtotal CHECK (subtotal = cantidad * precio_unitario)
);

-- ==============================================================================
-- 5. ÍNDICES
-- ==============================================================================

CREATE INDEX idx_usuario_ultimo_acceso ON usuarios(fecha_ultimo_acceso);
CREATE INDEX idx_membresia_ingresos ON membresias_cliente(fecha_compra, monto_pagado);
CREATE INDEX idx_membresia_estado_vencimiento ON membresias_cliente(estado_membresia, fecha_fin);
CREATE INDEX idx_ventas_fecha ON ventas(fecha_venta);
CREATE INDEX idx_producto_stock ON productos(stock_actual);
CREATE INDEX idx_reserva_usuario ON reservas(id_usuario);
CREATE INDEX idx_clase_fecha_estado ON clases_programadas(fecha, estado);
CREATE INDEX idx_detalle_producto ON detalles_venta(id_producto);
CREATE INDEX idx_asistencia_usuario_fecha ON asistencias(id_usuario, fecha_hora_entrada);

-- ==============================================================================
-- 6. SEED DATA
-- ==============================================================================

INSERT INTO roles (nombre) VALUES ('ADMIN'), ('RECEPCION'), ('ENTRENADOR'), ('CLIENTE');

INSERT INTO usuarios (id_rol, nombre, apellido, email, password_hash, genero, fecha_nacimiento, fecha_ultimo_acceso) VALUES
(1, 'Admin', 'Sistema', 'admin@gym.com', '$2a$12$owyB76Fm.n2C7Jh2wjnhheUCppPkVePK2eGPCwkdvb/vrcx/hUxqu', 'FEMENINO', '1985-04-12', CURRENT_TIMESTAMP),
(2, 'Laura', 'Torres', 'laura.torres@gym.com', '$2a$12$owyB76Fm.n2C7Jh2wjnhheUCppPkVePK2eGPCwkdvb/vrcx/hUxqu', 'MASCULINO', '1990-10-21', CURRENT_TIMESTAMP),
(3, 'Carlos', 'Rivas', 'carlos.rivas@gym.com', '$2a$12$owyB76Fm.n2C7Jh2wjnhheUCppPkVePK2eGPCwkdvb/vrcx/hUxqu', 'MASCULINO', '1992-03-05', CURRENT_TIMESTAMP), -- Entrenador
(4, 'Juan', 'Pérez', 'juan.perez@email.com', '$2a$12$owyB76Fm.n2C7Jh2wjnhheUCppPkVePK2eGPCwkdvb/vrcx/hUxqu', 'MASCULINO', '1995-02-15', CURRENT_TIMESTAMP), -- Cliente activo
(4, 'María', 'Gómez', 'maria.gomez@email.com', '$2a$12$owyB76Fm.n2C7Jh2wjnhheUCppPkVePK2eGPCwkdvb/vrcx/hUxqu', 'FEMENINO', '1998-07-30', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 20 DAY)); 

INSERT INTO planes_membresia (nombre, dias_duracion, precio) VALUES ('Mensual', 30, 100.00), ('Anual', 365, 1000.00);

INSERT INTO membresias_cliente (id_usuario, id_plan, fecha_inicio, fecha_fin, monto_pagado, metodo_pago, renovacion_automatica) VALUES
(4, 1, DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 20 DAY), 100.00, 'TARJETA_CREDITO', TRUE),
(5, 2, DATE_SUB(CURDATE(), INTERVAL 200 DAY), DATE_ADD(CURDATE(), INTERVAL 165 DAY), 1000.00, 'EFECTIVO', FALSE);

INSERT INTO disciplinas (nombre, capacidad_base) VALUES ('Spinning', 20), ('Crossfit', 15), ('Yoga', 25);

INSERT INTO clases_programadas (id_disciplina, id_instructor, fecha, hora_inicio, hora_fin, capacidad_maxima) VALUES
(1, 3, CURDATE(), '18:00:00', '19:00:00', 20);

INSERT INTO reservas (id_clase, id_usuario) VALUES (1, 4);
UPDATE clases_programadas SET cupos_reservados = 1 WHERE id_clase = 1;

INSERT INTO asistencias (id_usuario, fecha_hora_entrada, fecha_hora_salida) VALUES
(4, DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR));

INSERT INTO categorias_producto (nombre) VALUES ('Suplementos'), ('Bebidas Energéticas'), ('Indumentaria');

INSERT INTO productos (id_categoria, codigo_barras, nombre, precio_venta, costo_compra, stock_actual, stock_minimo) VALUES
(1, '7701234567890', 'Proteína Whey 1kg', 120.00, 80.00, 15, 5),
(2, '7701234567891', 'Bebida Rehidratante 500ml', 5.00, 2.50, 50, 20),
(3, '7701234567892', 'Toalla de Microfibra Gym', 25.00, 10.00, 3, 10); -- Stock crítico

INSERT INTO ventas (id_usuario_cliente, id_usuario_vendedor, total_venta, metodo_pago) VALUES
(4, 2, 125.00, 'TARJETA_DEBITO');

INSERT INTO detalles_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 1, 120.00, 120.00),
(1, 2, 1, 5.00, 5.00);

-- Actualizaciones explícitas del stock basadas en las ventas iniciales registradas
UPDATE productos SET stock_actual = stock_actual - 1 WHERE id_producto = 1; -- Se vendió 1 Proteína Whey
UPDATE productos SET stock_actual = stock_actual - 1 WHERE id_producto = 2; -- Se vendió 1 Bebida Rehidratante