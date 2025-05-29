# Microsserviços

Este diretório reúne todos os seus microsserviços em TypeScript/Express/RabbitMQ.

## Como criar um novo microsserviço

1. Para começar, navegue até a pasta dos microsserviços:
    ```
    cd microsservicos
    ```
2. Em seguida, basta executar:
    - Em Unix-like:
    ```
    sudo chmod +x ../config/scaffold-ms.sh && ../config/scaffold-ms.sh <nome-do-servico>
    ```
    - Em Windows:
    ```
    bash ../config/scaffold-ms.sh <nome-do-servico>
    ```
3. Agora, navegue até a pasta criada e instale as dependências:
    ```
    cd <nome-do-servico>
    npm install
    ```
4. Pronto! Agora você já pode começar a desenvolver:
   - ```npm run start:dev``` para iniciar em modo de desenvolvimento (com nodemon)
   - ```npm run build``` para buildar
   - ```npm start:dist``` para rodar o build compilado 

---

> **Dica:** se quiser ajustar configurações (por exemplo, tsconfig, nodemon), edite os arquivos gerados em cada serviço:
> - tsconfig.json
> - nodemon.json
> - package.json

Bom desenvolvimento! 🚀
