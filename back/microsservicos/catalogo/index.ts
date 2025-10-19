import { closeRabbitMQConnection } from 'common'
import { startQueue } from './shared/eventsHandler'
import { App } from './shared/server/app'
import { Environments } from './shared/environments'

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