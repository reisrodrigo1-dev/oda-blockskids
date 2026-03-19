FROM node:20-bookworm AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN echo "VITE_API_URL=" > client/.env
ENV VITE_API_URL=
RUN npm run build

FROM node:20-bookworm-slim AS runtime
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates wget tar gzip \
    && rm -rf /var/lib/apt/lists/*

RUN wget -q https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Linux_64bit.tar.gz -O /tmp/arduino-cli.tar.gz \
    && tar -xzf /tmp/arduino-cli.tar.gz -C /usr/local/bin arduino-cli \
    && chmod +x /usr/local/bin/arduino-cli \
    && rm /tmp/arduino-cli.tar.gz \
    && arduino-cli config init --overwrite \
    && arduino-cli core update-index \
    && arduino-cli core install arduino:avr

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=8080
ENV ARDUINO_CLI_PATH=/usr/local/bin/arduino-cli

EXPOSE 8080

CMD ["npm", "run", "start"]
