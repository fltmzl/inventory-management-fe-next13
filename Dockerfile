FROM node:20-alpine

WORKDIR /app

# Salin file definisi dependensi
COPY package*.json ./

# Install dependensi aplikasi
RUN npm install

# Salin seluruh file aplikasi (termasuk file .env)
COPY . .

# Build aplikasi Next.js (Next.js otomatis memuat konfigurasi dari file .env)
RUN npm run build

# Expose port Next.js
EXPOSE 3000

ENV PORT=3000

# Jalankan aplikasi
CMD ["npm", "start"]
