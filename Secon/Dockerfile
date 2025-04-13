FROM node:20-alpine

WORKDIR /app

# Копируем package.json и lock файл
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем всё остальное
COPY . .

# Сборка проекта
RUN npm run build

# Устанавливаем сервер для production preview
RUN npm install -g serve


CMD ["npm", "run", "preview"]
