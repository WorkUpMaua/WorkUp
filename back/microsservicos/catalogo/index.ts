import { Environments } from './shared/environments'
import { startQueue } from './shared/handlers/event/eventsHandler'
import { App } from './shared/handlers/server/app'
import { closeRabbitMQConnection } from './shared/infra/clients/rabbitmq/rabbitmq'
import { startDoorCodeFetchConsumer, startDoorCodeVerificationConsumer } from './shared/infra/clients/rabbitmq/doorCodeVerificationConsumer'


const port = Environments.getEnvs().port
new App().server.listen(port, async () => {
    console.log(`Catalogos. Porta: ${port}`)
    try {
        await startQueue()
        await startDoorCodeVerificationConsumer()
        await startDoorCodeFetchConsumer()
    } catch (error) {
        console.error('Failed to start RabbitMQ consumers', error)
        process.exit(1)
    }
})

// Desligamento seguro do RabbitMQ
process.on('SIGINT', async () => {
    console.log('Service catalogo interrupted!')
    await closeRabbitMQConnection()
    process.exit(0)
})
