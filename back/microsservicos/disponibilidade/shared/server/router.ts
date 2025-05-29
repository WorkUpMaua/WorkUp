import { Router } from "express"
import { getAllDisponibilidadeController } from "../../app/get_all_disponibilidade/get_all_disponibilidade_presenter"

const router: Router = Router()

router.get('/availability', (req, res) => getAllDisponibilidadeController.handle(req, res))

export { router,  }