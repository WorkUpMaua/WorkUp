import { closeRabbitMQConnection } from 'common'

import dotenv from 'dotenv'
import path from 'path'
import { startQueue } from './shared/eventsHandler'
import { App } from './shared/server/app'
dotenv.config({
    path: path.resolve(__dirname, '..', '..', '.env')
})

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