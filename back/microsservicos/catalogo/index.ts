import { Environments } from './shared/environments'
import { startQueue } from './shared/handlers/event/eventsHandler'
import { App } from './shared/handlers/server/app'
import { closeRabbitMQConnection } from './shared/infra/clients/rabbitmq/rabbitmq'


const port = Environments.getEnvs().port
new App().server.listen(port, () => {
    console.log(`Catalogos. Porta: ${port}`)
    startQueue()
})

// Desligamento seguro do RabbitMQ
process.on('SIGINT', async () => {
    console.log('Service catalogo interrupted!')
    await closeRabbitMQConnection()
    process.exit(0)
})