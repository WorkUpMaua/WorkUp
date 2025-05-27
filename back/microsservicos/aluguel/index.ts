import { App } from './app'

const port = 4002
new App().server.listen(port, () => {
    console.log(`Aluguel. Porta: ${port}`)
})