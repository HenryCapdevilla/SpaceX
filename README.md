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


Instrucciones de despliegue (ECR + ECS Fargate)

Este apartado describe el proceso seguido para construir y desplegar la aplicación web dentro de un contenedor Docker, utilizando Amazon ECS con la modalidad de ejecución Fargate.

    Construcción de la imagen Docker

Desde la raíz del proyecto frontend (por ejemplo, un proyecto Vite/React), se ejecutó el siguiente comando:

docker build -t my-react-app .

    Creación del repositorio en Amazon ECR

    Ir a Amazon ECR > Create Repository.

    Nombre del repositorio: spacex/production

    Configuraciones:

        Tag mutability: Mutable

        Encryption: AES-256 (por defecto)

Una vez creado, se obtiene el URI del repositorio. Por ejemplo:

577638359624.dkr.ecr.us-east-1.amazonaws.com/spacex/production

    Subida de la imagen a ECR

    Autenticarse en ECR:

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 577638359624.dkr.ecr.us-east-1.amazonaws.com

    Etiquetar la imagen local con el repositorio:

docker tag my-react-app:latest 577638359624.dkr.ecr.us-east-1.amazonaws.com/spacex/production:latest

    Subir la imagen:

docker push 577638359624.dkr.ecr.us-east-1.amazonaws.com/spacex/production:latest

    Configuración de ECS y Fargate

    Ir a Amazon ECS > Clusters > Create Cluster

        Tipo: Networking only (Fargate)

        Nombre del clúster: SpacexCluster

        Crear (si da error por falta de rol, ir a IAM y crear la ECS service-linked role).

    Ir a Tasks > Task Definitions > Create new Task Definition

        Tipo de lanzamiento: Fargate

        Nombre: spacex-frontend-task

        Container definition:

            Image: 577638359624.dkr.ecr.us-east-1.amazonaws.com/spacex/production:latest

            Memory: 512 MiB

            CPU: 256

            Port mappings: 80:80

        Network mode: awsvpc

        Task role: dejar predeterminado

    Crear el servicio en el clúster:

        Tipo de servicio: Fargate

        Task definition: seleccionar la creada

        Número de tareas: 1

        Cluster: SpacexCluster

        Subred pública (con ruta a Internet Gateway)

        Security group: permitir tráfico HTTP (puerto 80)

    Verificación

    Ir al clúster > pestaña Tasks

    Esperar a que el estado sea RUNNING

    Hacer clic en la tarea > pestaña Networking

    Copiar la IP pública y acceder vía navegador:

http://<ip-pública>