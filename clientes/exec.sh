#!/bin/bash

# Roda o script wait-for-it.js com node
node wait-for-it.js

# Captura o código de saída do node
EXIT_CODE=$?

# Verifica se o código de saída é 0
if [ $EXIT_CODE -eq 0 ]; then
  # Roda o comando npm run dev
  npm run dev
else
  # Mostra uma mensagem de erro
  echo "O node não fechou com exit(0)"
fi
