import { App } from './app'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({
    path: path.resolve(__dirname, '..', '..', '.env')
})

const port = process.env.USER_MSS_PORT
new App().server.listen(port, () => {
    console.log(`User. Porta: ${port}`)
})