# Configurando RabbitMQ com Docker

Este guia descreve os passos necessários para configurar rapidamente uma instância do RabbitMQ utilizando Docker.

---

## Pré-requisitos

Antes de começar, você precisa ter o **Docker** instalado em sua máquina.  
Se ainda não instalou, acesse o site oficial para obter instruções:

- [Site oficial do Docker](https://www.docker.com/)

---

## Passo a passo

### 1. Instalar o Docker

Certifique-se de que o Docker está instalado e em funcionamento no seu sistema operacional.

### 2. Executar o container RabbitMQ

Abra o terminal e execute o seguinte comando:

```bash
docker run -d --hostname my-rabbit --name some-rabbit -p 5672:5672 -p 8080:15672 rabbitmq:3-management
```

Esse comando:

- Executa o container em segundo plano (`-d`)
- Define o nome do host como `my-rabbit`
- Nomeia o container como `some-rabbit`
- Mapeia a porta `15672` (painel do RabbitMQ) para a porta `8080` do host
- Usa a imagem oficial `rabbitmq:3-management`, que inclui a interface de gerenciamento

### 3. Acessar a interface de gerenciamento

Após iniciar o container, você pode acessar o painel de controle do RabbitMQ de duas formas:

- Através da UI do Docker (Docker Desktop)
- Ou diretamente via navegador em: [http://localhost:8080/](http://localhost:8080/)

---

## Recursos úteis

- [Documentação oficial do RabbitMQ](https://www.rabbitmq.com/)
- [Imagem oficial do RabbitMQ no Docker Hub](https://hub.docker.com/_/rabbitmq)

---

## Informações adicionais

- Usuário padrão: `guest`  
- Senha padrão: `guest`  

> Obs: o usuário `guest` só pode acessar via `localhost` por padrão.

---

Siga esses passos para ter uma instância funcional do RabbitMQ rodando localmente em poucos minutos.
