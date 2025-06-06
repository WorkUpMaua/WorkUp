import { App } from "./shared/server/app"


const port = 4004
new App().server.listen(port, () => {
    console.log(`Propriedade. Porta: ${port}`)
})
