import { App } from './app'

const port = 4001
new App().server.listen(port, () => {
    console.log(`User. Porta: ${port}`)
})