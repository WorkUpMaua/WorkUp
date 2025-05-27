
import dotenv from 'dotenv'
import path from 'path'
import { App } from './shared/server/app'
dotenv.config({
    path: path.resolve(__dirname, '..', '..', '.env')
})

const port = process.env.USER_MSS_PORT
new App().server.listen(port, () => {
    console.log(`User. Porta: ${port}`)
})