# Imagen base ligera de Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm install --omit=dev

# Copiar el resto del código
COPY . .

# Crear usuario no root por seguridad
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nodejs -u 1001 \
  && chown -R nodejs:nodejs /app

USER nodejs

# Puerto configurable (por defecto 3000)
ARG PORT=4000
ENV PORT=${PORT}
EXPOSE ${PORT}

# Health check cada 30s
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${PORT}', res => process.exit(res.statusCode === 200 ? 0 : 1))"

# Comando por defecto
CMD ["npm", "start"]
