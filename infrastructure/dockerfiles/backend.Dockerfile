FROM node:20-alpine
WORKDIR /app
COPY .. ../
RUN cd backend && npm install && npm run build
CMD ["npm", "--prefix", "backend", "run", "start"]
