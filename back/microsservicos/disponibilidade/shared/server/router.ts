import { Router } from "express"
import { getAllDisponibilidadeController } from "../../app/get_all_disponibilidade/get_all_disponibilidade_presenter"
import { createDisponibilidadeController } from "../../app/create_disponibilidade/create_disponibilidade_presenter"

const router: Router = Router()

router.get('/availability', (req, res) => getAllDisponibilidadeController.handle(req, res))
router.post('/availability', async (req, res) => await createDisponibilidadeController.handle(req, res))

export { router,  }