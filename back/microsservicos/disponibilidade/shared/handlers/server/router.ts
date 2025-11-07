import { Router } from "express"
import { getAllDisponibilidadeController } from "../../../app/get_all_disponibilidade/get_all_disponibilidade_presenter"
import { getDisponibilidadeController } from "../../../app/get_disponibilidade/get_disponibilidade_presenter"
import { createDisponibilidadeController } from "../../../app/create_disponibilidade/create_disponibilidade_presenter"
import { updateDisponibilidadeController } from "../../../app/update_disponibilidade/update_disponibilidade_presenter"
import { deleteDisponibilidadeController } from "../../../app/delete_disponibilidade/delete_disponibilidade_presenter"


const router: Router = Router()

router.get('/availability', (req, res) => getAllDisponibilidadeController.handle(req, res))
router.get('/availability/:id', (req, res) => getDisponibilidadeController.handle(req, res))
router.post('/availability', async (req, res) => await createDisponibilidadeController.handle(req, res))
router.patch('/availability/:id', async (req, res) => await updateDisponibilidadeController.handler(req, res))
router.delete('/availability/:id', async (req, res) => await deleteDisponibilidadeController.handle(req, res))

export { router, }