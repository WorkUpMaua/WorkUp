# Microsserviços

Este diretório reúne todos os seus microsserviços em TypeScript/Express/RabbitMQ.

## Como criar um novo microsserviço

1. Para começar, navegue até a pasta dos microsserviços:
    cd microsservicos

2. Em seguida, basta executar:
    - Em Unix-like:
        sudo chmod +x ../config/scaffold-ms.sh
        ../config/scaffold-ms.sh <nome-do-servico> <numero-da-porta>
    - Em Windows:
        bash ../config/scaffold-ms.sh <nome-do-servico> <numero-da-porta>

3. Agora, navegue até a pasta criada e instale as dependências:
    cd <nome-do-servico>
    npm install

4. Pronto! Agora você já pode começar a desenvolver:
    - npm run start:dev  (inicia em modo de desenvolvimento com nodemon)
    - npm run build      (gera build dist)
    - npm run start:dist (roda o build compilado)

Dica: ajustes adicionais podem ser feitos nos arquivos gerados automaticamente:
- tsconfig.json
- nodemon.json
- package.json

---

## Como testar

### 1. Ferramentas necessárias

Para rodar os microsserviços com Kubernetes, você precisa instalar:

- Docker Desktop: https://www.docker.com/products/docker-desktop/
- Kubernetes habilitado dentro do Docker Desktop

Após instalar o Docker Desktop, vá em:
Settings → Kubernetes → marque "Enable Kubernetes" → clique em "Apply & Restart".

Confirme que o Kubernetes está funcionando:
kubectl version --client

---

### 2. Criar o arquivo .env

Na raiz do backend, crie um arquivo chamado `.env` dentro da pasta `back`, a partir do arquivo `.env.example` para referência.

---

### 3. Criar ConfigMap e Secret no Kubernetes

Entre na pasta dos manifests Kubernetes:
```
cd back/microsservicos/kubernetes
```


#### macOS / Linux (Zsh ou Bash)

Criar ConfigMap com variáveis não sensíveis:
```
kubectl create configmap workup-config \
  --from-env-file=<(grep -vE 'AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY' ../../.env) \
  --dry-run=client -o yaml | kubectl apply -f -
```
Criar Secret com variáveis sensíveis:
```
kubectl create secret generic workup-secrets \
  --from-env-file=<(grep -E 'AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY' ../../.env) \
  --dry-run=client -o yaml | kubectl apply -f -
```
#### Windows (PowerShell)
Criar ConfigMap com variáveis não sensíveis:
```
Get-Content ../../.env | Select-String -NotMatch 'AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY' | Set-Content .env.nonsensitive
kubectl create configmap workup-config --from-env-file=.env.nonsensitive --dry-run=client -o yaml | kubectl apply -f -
Remove-Item .env.nonsensitive
```

Criar Secret com variáveis sensíveis:
```
Get-Content ../../.env | Select-String 'AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY' | Set-Content .env.aws
kubectl create secret generic workup-secrets --from-env-file=.env.aws --dry-run=client -o yaml | kubectl apply -f -
Remove-Item .env.aws
```

---

### 4. Subir os microsserviços no Kubernetes

Ainda na pasta:
```
cd back/microsservicos/kubernetes
```

Execute:
```
kubectl apply -f .
```

Verifique se tudo subiu:
```
kubectl get pods
kubectl get svc
```

---

### 5. Endpoints locais para testar no Postman

Os microsserviços usam NodePort e expõem portas locais:

catalogo           → http://localhost:32083
disponibilidade    → http://localhost:32082
property           → http://localhost:32081
user               → http://localhost:32080

---

### 6. Deletar/limpar tudo

Para remover todos os recursos criados:

```
kubectl delete -f .
```

Ou para remover apenas um serviço ou deployment específico:
```
kubectl delete deployment <nome-do-deployment>
kubectl delete service <nome-do-service>
```

---

### 7. Comandos úteis de depuração

Ver pods rodando:
```
kubectl get pods
```

Ver logs de um pod:
```
kubectl logs <nome-do-pod>
```

Reiniciar um deployment:
```
kubectl rollout restart deployment <nome-do-deployment>
```

Ver detalhes de um serviço:
```
kubectl describe svc <nome-do-service>
```
---

Pronto! Projeto rodando 🚀
