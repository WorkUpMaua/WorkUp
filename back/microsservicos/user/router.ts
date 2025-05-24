import { Router } from "express";
import { getAllUserController } from "./app/get_all_user/get_all_user_presenter";
import { getUserController } from "./app/get_user/get_user_presenter";
import { createUserController } from "./app/create_user/create_user_presenter";
import { loginUserController } from "./app/login_user/login_user_presenter";

const router: Router = Router()

router.get('/user', (req, res) => getAllUserController.handle(req, res))
router.get('/user/:id', (req, res) => getUserController.handle(req, res))
router.get('/login', (req, res) => loginUserController.handle(req, res))
router.post('/user', async (req, res) => await createUserController.handle(req, res))

export { router }