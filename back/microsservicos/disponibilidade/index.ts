import { App } from './shared/server/app'

const port = 4003
new App().server.listen(port, () => {
    console.log(`Disponibilidade. Porta: ${port}`)
})
