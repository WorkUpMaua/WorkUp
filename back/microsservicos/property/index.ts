import { App } from './shared/handlers/server/app'
import { startQueue } from './shared/handlers/events/eventHandler'
import { closeRabbitMQConnection } from './shared/infra/clients/rabbitmq/rabbitmq'
import { Environments } from './shared/environments'

const port = Environments.getEnvs().port
new App().server.listen(port, () => {
    console.log(`Propriedade. Porta: ${port}`)
    startQueue()
})

// Desligamento seguro do RabbitMQ
process.on('SIGINT', async () => {
    console.log('Service disponibilidade interrupted!')
    await closeRabbitMQConnection()
    process.exit(0)
})