import { closeRabbitMQConnection } from 'common'
import dotenv from 'dotenv'
import path from 'path'
import { App } from './shared/server/app'
import { startQueue } from './shared/eventHandler'
dotenv.config()

const port = process.env.USER_MSS_PORT
new App().server.listen(port, () => {
    console.log(`User. Porta: ${port}`)
    startQueue()
})

// Desligamento seguro do RabbitMQ
process.on('SIGINT', async () => {
    console.log('Service catalogo interrupted!')
    await closeRabbitMQConnection()
    process.exit(0)
})