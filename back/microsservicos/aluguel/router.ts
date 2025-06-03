import { Router } from "express";

import { createAluguelController } from "./app/create_aluguel/create_aluguel_presenter";
import { getAllAluguelController } from "./app/get_all_aluguel/get_all_aluguel_presenter";
import { getAluguelController } from "./app/get_aluguel/get_aluguel_presenter";
import { updateAluguelController } from "./app/update_aluguel/update_aluguel_presenter";
import { deleteAluguelController } from "./app/delete_aluguel/delete_aluguel_presenter";

const router: Router = Router()

router.post('/aluguel', (req, res) => createAluguelController.handle(req, res))
router.get('/aluguel', (req, res) => getAllAluguelController.handle(req, res))
router.get('/aluguel/:id', (req, res) => getAluguelController.handle(req, res))
router.patch('/aluguel/:id', (req, res) => updateAluguelController.handle(req, res))
router.delete('/aluguel/:id', (req, res) => deleteAluguelController.handle(req, res))

export { router }