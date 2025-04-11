# 🚀 SpaceX Mission Dashboard

Aplicación frontend desarrollada en React + TypeScript que muestra información detallada y visual de los lanzamientos de SpaceX, consumiendo una API personalizada desplegada en AWS.

## 🌐 Demo

[🔗 Ver demo en línea](http://3.81.85.83/)

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

```
spacex-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/       # Componentes reutilizables
│   ├── pages/            # Vistas principales
│   ├── services/         # Llamadas a la API (fetch/Axios)
│   ├── hooks/            # Hooks personalizados
│   ├── styles/           # Archivos CSS/Tailwind personalizados
│   ├── App.tsx           # Punto principal de la app
│   └── main.tsx          # Punto de entrada con ReactDOM
├── .env                  # Variables de entorno
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## 🚀 Funcionalidades

- Visualización de lanzamientos de SpaceX (nombre, fecha, estado, cohete, etc.).
- Gráficas comparativas dinámicas por campo (fecha, estado, misión, etc.).
- Filtro personalizado para buscar por campo específico.
- Interfaz responsive y profesional.
- Datos almacenados y consultados desde DynamoDB vía AWS Lambda.

## 🛠️ Instrucciones de despliegue (ECR + ECS Fargate)

Este apartado describe el proceso seguido para construir y desplegar la aplicación web dentro de un contenedor Docker, utilizando Amazon ECS con la modalidad de ejecución Fargate.

### 1. Construcción de la imagen Docker

Desde la raíz del proyecto frontend (por ejemplo, un proyecto Vite/React), se ejecuta:

```bash
docker build -t my-react-app .
```

### 2. Creación del repositorio en Amazon ECR

1. Ir a Amazon ECR > Create Repository
2. Nombre del repositorio: `spacex/production`
3. Configuraciones:
   - Tag mutability: `Mutable`
   - Encryption: `AES-256` (por defecto)

Una vez creado, se obtiene el URI del repositorio. Por ejemplo:

```
577638359624.dkr.ecr.us-east-1.amazonaws.com/spacex/production
```

### 3. Subida de la imagen a ECR

Autenticarse en ECR:

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 577638359624.dkr.ecr.us-east-1.amazonaws.com
```

Etiquetar la imagen:

```bash
docker tag my-react-app:latest 577638359624.dkr.ecr.us-east-1.amazonaws.com/spacex/production:latest
```

Subir la imagen:

```bash
docker push 577638359624.dkr.ecr.us-east-1.amazonaws.com/spacex/production:latest
```

### 4. Configuración de ECS y Fargate

#### Crear clúster

- Ir a Amazon ECS > Clusters > Create Cluster
- Tipo: `Networking only (Fargate)`
- Nombre del clúster: `DevCluster`
- Si da error por rol, ir a IAM y crear la ECS service-linked role

#### Crear definición de tarea

- Ir a Task Definitions > Create new Task Definition
- Tipo de lanzamiento: `Fargate`
- Nombre: `spacex-frontend-task`
- Definir contenedor:
  - Image: `577638359624.dkr.ecr.us-east-1.amazonaws.com/spacex/production:latest`
  - Memory: `3 GB`
  - vCPU: `1`
  - Port mappings: `80:80`
- Network mode: `awsvpc`
- Task role: dejar predeterminado

#### Crear servicio

- Tipo de servicio: `Fargate`
- Task definition: seleccionar la creada
- Número de tareas: `1`
- Cluster: `DevCluster`
- Red: usar una subred pública con ruta a Internet Gateway
- Security group: permitir tráfico HTTP (puerto 80)

### 5. Verificación

- Ir al clúster > pestaña Tasks
- Esperar a que el estado sea RUNNING
- Hacer clic en la tarea > pestaña Networking
- Copiar la IP pública y acceder desde el navegador:

```
http://<ip-pública>
```

---

```bash
# Clona el repositorio
git clone https://github.com/HenryCapdevilla/SpaceX.git
cd spacex-frontend

# Instala las dependencias
npm install

# Ejecuta la app
npm run dev
```

