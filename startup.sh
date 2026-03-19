#!/bin/bash

ARDUINO_CLI_BIN="/home/arduino-cli"
ARDUINO_DATA_DIR="/home/.arduino15"

export HOME="/home"
export PATH="$PATH:/home"
export ARDUINO_CLI_PATH="$ARDUINO_CLI_BIN"
export ARDUINO_DIRECTORIES_DATA="$ARDUINO_DATA_DIR"
export ARDUINO_DIRECTORIES_USER="/home/Arduino"

# Instala Arduino CLI se não existe
if [ ! -f "$ARDUINO_CLI_BIN" ]; then
  echo "📦 Instalando Arduino CLI..."
  wget -q https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Linux_64bit.tar.gz -O /tmp/arduino-cli.tar.gz
  tar -xzf /tmp/arduino-cli.tar.gz -C /home arduino-cli
  chmod +x "$ARDUINO_CLI_BIN"
  rm /tmp/arduino-cli.tar.gz
  echo "✅ Arduino CLI instalado em $ARDUINO_CLI_BIN"
fi

# Garante que a configuracao e o core arduino:avr existam de fato
if [ ! -f "$ARDUINO_DATA_DIR/arduino-cli.yaml" ]; then
  "$ARDUINO_CLI_BIN" config init --overwrite
fi

if ! "$ARDUINO_CLI_BIN" core list | grep -q "arduino:avr"; then
  echo "📦 Instalando arduino:avr core (pode demorar ~2 min)..."
  "$ARDUINO_CLI_BIN" core update-index
  "$ARDUINO_CLI_BIN" core install arduino:avr
  echo "✅ arduino:avr core instalado"
fi

echo "🚀 Iniciando servidor Node.js..."
node dist/index.js
