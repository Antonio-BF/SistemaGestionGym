# Sistema de Gestión de Gimnasio (Gym Management System)

Este repositorio contiene un monorepo para la aplicación de gestión de gimnasio, dividido en un frontend desarrollado con **Angular 21** y un backend desarrollado con **Spring Boot**.

## 📁 Estructura del Proyecto

```
/
├── FrontendGym/          # Proyecto frontend (Angular 21)
└── SistemaGestionGym/    # Proyecto backend (Spring Boot)
```

## 🚀 Tecnologías Utilizadas

* **Frontend:** Angular 21 (Signals, componentes standalone y formularios reactivos)
* **Backend:** Spring Boot (Java, Spring Security / JWT, JPA/Hibernate)
* **Base de Datos:** MySQL

## ⚙️ Requisitos Previos

Asegúrate de tener instalado en tu entorno de desarrollo:

* **Node.js** (versión compatible con Angular 21)
* **Java Development Kit (JDK)** 17
* **Maven** (o puedes usar el Maven Wrapper incluido en el backend)

## 🛠️ Configuración y Ejecución Local

### 1. Backend (SistemaGestionGym)

1. Abre una terminal y navega a la carpeta del backend:
   ```bash
   cd SistemaGestionGym
   ```
2. Configura tus credenciales de base de datos en el archivo de propiedades (`src/main/resources/application.properties`).
3. Ejecuta la aplicación con Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(En Windows puedes usar `mvnw.cmd spring-boot:run`)*

### 2. Frontend (FrontendGym)

1. Abre otra terminal y navega a la carpeta del frontend:
   ```bash
   cd FrontendGym
   ```
2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   ng serve
   ```
4. Abre tu navegador e ingresa a `http://localhost:4200/`.

## 📌 Funcionalidades Actuales

* Módulo de Autenticación (Login).
* Módulo de Gestión de Usuarios.