# Etapa de construcción con Node.js
FROM node:18-slim AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN echo "Ejecutando npm run build..." && npm run build && echo "Build completado"

# Verificar si la carpeta 'dist' se generó correctamente
RUN echo "Contenido de /app:" && ls -la /app
RUN echo "Contenido de /app/dist:" && ls -la /app/dist || echo "La carpeta dist no existe"

# Etapa final con Nginx
FROM nginx:1.25.2-alpine

# Copiar los archivos construidos desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80
