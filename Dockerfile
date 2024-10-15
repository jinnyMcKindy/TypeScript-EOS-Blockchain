# Указываем базовый образ
FROM node:16

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json в контейнер
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Устанавливаем TypeScript
RUN npm install -g typescript

# Копируем остальные файлы в контейнер
COPY . .

# Компилируем TypeScript файлы
RUN tsc src/node.ts --outDir dist

# Команда для запуска вашего приложения
CMD ["npm", "run"]