FROM node:20-alpine
WORKDIR /app
COPY .. ../
RUN cd frontend && npm install && npm run build
CMD ["npm", "--prefix", "frontend", "start"]
