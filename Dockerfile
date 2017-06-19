FROM node:8.1

# Define working directory.
WORKDIR /app

COPY package.json /app

ENV NODE_PATH /app/node_modules
ENV PATH "$PATH:/app/node_modules/.bin"
RUN cd /app && npm install

# Define default command.
CMD ["gulp", "watch"]
