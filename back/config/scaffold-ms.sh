#!/usr/bin/env bash

# scaffold-ms.sh — cria a estrutura de um microserviço TS+Express+RabbitMQ
# Uso:
#   chmod +x scaffold-ms.sh
#   ./scaffold-ms.sh <nome-do-servico> <porta>

SERVICE=$1
PORT=$2

if [[ -z "$SERVICE" || -z "$PORT" ]]; then
  echo "Uso: $0 <nome-do-servico> <porta>"
  exit 1
fi

ROOT="./$SERVICE"

echo "🛠️  Criando pastas…"
mkdir -p "$ROOT"/{app,shared/{repo,server}}

echo "📄  Criando arquivos vazios em shared…"
for f in environments.ts eventHandler.ts interfaces.ts types.ts; do
  : > "$ROOT/shared/$f"
done
for f in app.ts router.ts; do
  : > "$ROOT/shared/server/$f"
done

echo "📄  Criando app.ts em shared/server…"
cat > "$ROOT/shared/server/app.ts" << 'EOF'
import express from 'express'
import { router } from './router'

export class App {
  public server: express.Application

  constructor() {
    this.server = express()
    this.middleware()
    this.router()
  }

  private middleware() {
    this.server.use(express.json())
  }

  private router() {
    this.server.use(router)
  }
}
EOF

echo "📄  Criando router.ts em shared/server…"
cat > "$ROOT/shared/server/router.ts" << 'EOF'
import express from 'express'
import { Router } from 'express'

export const router = Router()

// defina suas rotas aqui
// ex: router.get('/health', (_, res) => res.send('OK'))
EOF

echo "📄  Criando index.ts na raiz…"
cat > "$ROOT/index.ts" << EOF
import { App } from './shared/server/app'

const port = ${PORT}
new App().server.listen(port, () => {
  console.log('${SERVICE}. Porta ' + port)
})
EOF

echo "📦  Criando package.json…"
cat > "$ROOT/package.json" << 'EOF'
{
  "name": "${SERVICE}",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start:dev": "nodemon",
    "build": "tsc",
    "start:dist": "node ./dist/index.js",
    "check": "tsc --noEmit"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "axios": "^1.9.0",
    "dotenv": "^16.5.0",
    "express": "^5.1.0",
    "uuid": "^11.1.0",
    "common": "file:../../common"
  },
  "devDependencies": {
    "@types/express": "^5.0.2",
    "@types/node": "^22.15.18",
    "nodemon": "^3.1.10",
    "ts-node": "^10.9.2",
    "typescript": "^5.8.3"
  }
}
EOF

echo "🔄  Criando nodemon.json…"
cat > "$ROOT/nodemon.json" << 'EOF'
{
  "watch": ["./"],
  "ext": "ts",
  "ignore": ["node_modules"],
  "exec": "ts-node index.ts"
}
EOF

echo "⚙️  Criando tsconfig.json…"
cat > "$ROOT/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "rootDir": "./",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    "./**/*.ts",
    "../environments.d.ts"
  ],
  "exclude": [
    "node_modules",
    "./dist"
  ],
  "paths": []
}
EOF

echo "✅  Estrutura '$SERVICE' criada:"
tree "$ROOT" --dirsfirst
