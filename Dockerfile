# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos package.json primero (mejor cache)
COPY package*.json ./

RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Construimos Angular en modo producción
RUN npm run build

# ---------- Stage 2: Nginx ----------
FROM nginx:stable-alpine

# Eliminamos configuración por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copiamos build generado
COPY --from=builder /app/dist/banking-front/browser /usr/share/nginx/html

# Copiamos configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]