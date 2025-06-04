import { closeRabbitMQConnection } from 'common'
import dotenv from 'dotenv'
import path from 'path'
import { startQueue } from './shared/eventHandler'
import { App } from './shared/server/app'
dotenv.config({
    path: path.resolve(__dirname, '..', '..', '.env')
})

const port = process.env.DISPONIBILIDADE_MSS_PORT
new App().server.listen(port, () => {
    console.log(`Disponibilidade. Porta: ${port}`)
    startQueue()
})

// Desligamento seguro do RabbitMQ
process.on('SIGINT', async () => {
    console.log('Service disponibilidade interrupted!')
    await closeRabbitMQConnection()
    process.exit(0)
})