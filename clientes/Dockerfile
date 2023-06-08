FROM node:lts-slim
WORKDIR /app
COPY . .
RUN npm install
CMD ["npx", "prisma", "migrate", "dev"]
CMD ["chmod", "+x", "exec.sh"]
# EXPOSE 80
