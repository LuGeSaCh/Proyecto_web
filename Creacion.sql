-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS RentadosDB;
USE RentadosDB;

-- 2. Tabla de Tipos de Vehiculo
CREATE TABLE IF NOT EXISTS TiposVehiculo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- 3. Tabla de Usuarios (Con Ubicacion para recomendaciones)
CREATE TABLE IF NOT EXISTS Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasenia VARCHAR(255) NOT NULL,
    rol ENUM('cliente', 'propietario', 'admin') DEFAULT 'cliente',
    telefono VARCHAR(20),
    departamento VARCHAR(50), -- Para geolocalizacion (Ej: San Salvador)
    municipio VARCHAR(50),    -- Para geolocalizacion (Ej: Mejicanos)
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Vehiculos
CREATE TABLE IF NOT EXISTS Vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    propietarioId INT NOT NULL,
    tipoId INT NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio INT NOT NULL,
    precioPorDia DECIMAL(10, 2) NOT NULL,
    imagenURL TEXT,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (propietarioId) REFERENCES Usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (tipoId) REFERENCES TiposVehiculo(id)
);

-- 5. Tabla de Alquileres
CREATE TABLE IF NOT EXISTS Alquileres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehiculoId INT NOT NULL,
    clienteId INT NOT NULL,
    fechaInicio DATE NOT NULL,
    fechaFin DATE NOT NULL,
    precioTotal DECIMAL(10, 2) NOT NULL,
    estado ENUM('pendiente', 'confirmado', 'curso', 'finalizado', 'cancelado') DEFAULT 'pendiente',
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (vehiculoId) REFERENCES Vehiculos(id),
    FOREIGN KEY (clienteId) REFERENCES Usuarios(id)
);

-- 6. Tabla de Pagos
CREATE TABLE IF NOT EXISTS Pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alquilerId INT NOT NULL UNIQUE,
    monto DECIMAL(10, 2) NOT NULL,
    metodoPago VARCHAR(50) NOT NULL,
    fechaPago DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'pagado',
    
    FOREIGN KEY (alquilerId) REFERENCES Alquileres(id)
);

ALTER TABLE Usuarios 
ADD COLUMN verificado BOOLEAN DEFAULT FALSE,
ADD COLUMN tokenVerificacion VARCHAR(100);

ALTER TABLE Usuarios 
ADD COLUMN tokenExpiracion DATETIME;


-- DATOS DE PRUEBA


INSERT IGNORE INTO TiposVehiculo (nombre) VALUES ('Sedán'), ('Camioneta'), ('Deportivo'), ('Pick-up');

INSERT IGNORE INTO Usuarios (nombre, correo, contrasenia, rol, departamento, municipio) VALUES 
('Carlos Propietario', 'carlos@rentados.com', '123456', 'propietario', 'San Salvador', 'San Salvador'),
('Ana Cliente', 'ana@gmail.com', '123456', 'cliente', 'La Libertad', 'Santa Tecla');

INSERT IGNORE INTO Vehiculos (propietarioId, tipoId, marca, modelo, anio, precioPorDia, imagenURL, descripcion) VALUES 
(1, 1, 'Toyota', 'Corolla', 2020, 40.00, 'https://ejemplo.com/corolla.jpg', 'Económico y seguro'),
(1, 3, 'Ford', 'Mustang', 2021, 60.00, 'https://ejemplo.com/mustang.jpg', 'Deportivo veloz');