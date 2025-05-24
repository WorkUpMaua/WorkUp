import { Router } from "express";
import { getAllUserController } from "./app/get_all_user/get_all_user_presenter";
import { createUserController } from "./app/create_user/create_user_presenter";

const router: Router = Router()

router.get('/user', (req, res) => getAllUserController.handle(req, res))
router.post('/user', (req, res) => createUserController.handle(req, res))

export { router }