# Usa la imagen oficial de Node como base
FROM node:latest AS build

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json para instalar las dependencias
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia todos los archivos del directorio actual al directorio /app en el contenedor
COPY . .

# Construye la aplicación Angular para producción
RUN npm run build --prod

# -----------------------------------------

# Configura el servidor web para servir la aplicación Angular
FROM nginx:alpine

# Copia los archivos de la compilación de la aplicación Angular al directorio de trabajo del servidor web de Nginx
COPY --from=build /app/dist/upload-file/browser /usr/share/nginx/html

# Copia la configuración personalizada de Nginx para la aplicación Angular
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80 para que la aplicación sea accesible desde fuera del contenedor
EXPOSE 80

# Comando para iniciar el servidor web de Nginx
CMD ["nginx", "-g", "daemon off;"]