# 🚀 SpaceX Mission Dashboard

Aplicación frontend desarrollada en React + TypeScript que muestra información detallada y visual de los lanzamientos de SpaceX, consumiendo una API personalizada desplegada en AWS.

## 🌐 Demo

[🔗 Ver demo en línea](http://52.207.217.103/)

---

## 🧪 Tecnologías

- ⚛️ **React + Vite + TypeScript**
- 🎨 **TailwindCSS** – Estilos rápidos y responsive
- 📊 **Chart.js / D3.js / Plotly** – Visualización de datos
- ☁️ **AWS Lambda + DynamoDB** – Backend serverless
- 🐳 **Docker** – Contenedores para despliegue
- 🚢 **ECS Fargate** – Hosting en la nube sin servidores

---

## 📁 Estructura del proyecto

spacex-frontend/ ├── public/ │ └── index.html ├── src/ │ ├── components/ # Componentes reutilizables │ ├── pages/ # Vistas principales │ ├── services/ # Llamadas a la API (fetch/Axios) │ ├── hooks/ # Hooks personalizados │ ├── styles/ # Archivos CSS/Tailwind personalizados │ ├── App.tsx # Punto principal de la app │ └── main.tsx # Punto de entrada con ReactDOM ├── .env # Variables de entorno ├── tailwind.config.js ├── tsconfig.json ├── vite.config.ts └── package.json


## 🚀 Funcionalidades

- Visualización de lanzamientos de SpaceX (nombre, fecha, estado, cohete, etc.).
- Gráficas comparativas dinámicas por campo (fecha, estado, misión, etc.).
- Filtro personalizado para buscar por campo específico.
- Interfaz responsive y profesional.
- Datos almacenados y consultados desde DynamoDB vía AWS Lambda.

## 🛠️ Instalación



```bash
# Clona el repositorio
git clone https://github.com/HenryCapdevilla/SpaceX.git
cd spacex-frontend

# Instala las dependencias
npm install

# Ejecuta la app
npm run dev