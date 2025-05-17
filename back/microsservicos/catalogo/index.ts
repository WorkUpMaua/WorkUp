import { App } from './app'

const port = 4000
new App().server.listen(port, () => {
    console.log(`Catalogos. Porta: ${port}`)
})