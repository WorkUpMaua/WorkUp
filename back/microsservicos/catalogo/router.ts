import { Router } from "express";
import { getHelloWorldController } from "./app/getHelloWorld/getHelloWorldController";

const router: Router = Router()

router.get('/', (req, res) => getHelloWorldController.handle(req, res))

export { router }