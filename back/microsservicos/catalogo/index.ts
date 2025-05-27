import { closeRabbitMQConnection, consumeEvents } from 'common'
import { App } from './app'
import dotenv from 'dotenv'
import path from 'path'
import { eventHandler } from './shared/eventsHandler'
dotenv.config({
    path: path.resolve(__dirname, '..', '..', '.env')
})

const startQueue = async () => {
    try {
        await consumeEvents('catalogo_queue', '#.updated', eventHandler)
        await consumeEvents('catalogo_queue', '#.deleted', eventHandler)
    } catch (err) {
        console.error('Couldn\'t start the service queues')
        process.exit(1)
    }
}

const port = process.env.CATALOG_MSS_PORT
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