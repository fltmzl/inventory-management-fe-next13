FROM node:20-slim

WORKDIR /app

# Salin file definisi dependensi
COPY package*.json ./

# Install seluruh dependensi aplikasi
RUN npm install --legacy-peer-deps

# Salin seluruh file aplikasi
COPY . .

# Build aplikasi Next.js
RUN npm run build

# Expose port Next.js
EXPOSE 3000

ENV PORT=3000

# Jalankan aplikasi
CMD ["npm", "start"]
