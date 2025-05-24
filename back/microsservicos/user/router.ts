import { Router } from "express";
import { getAllUserController } from "./app/get_all_user/get_all_user_presenter";

const router: Router = Router()

router.get('/user', (req, res) => getAllUserController.handle(req, res))

export { router }