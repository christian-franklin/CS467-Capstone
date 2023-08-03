FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY dist ./dist
ENV PORT=4173
EXPOSE ${PORT}
ENV GOOGLE_APPLICATION_CREDENTIALS='./cs467-capstone-393117-5eaafad445b8.json'
CMD ["npm", "run", "preview"]
