import { Router } from "express";
import { getAllUserController } from "./app/get_all_user/get_all_user_presenter";
import { getUserController } from "./app/get_user/get_user_presenter";
import { createUserController } from "./app/create_user/create_user_presenter";
import { loginUserController } from "./app/login_user/login_user_presenter";
import { updateUserController } from "./app/update_user/update_user_presenter";
import { deleteUserController } from "./app/delete_user/delete_user_presenter";

const router: Router = Router()

router.get('/user', (req, res) => getAllUserController.handle(req, res))
router.get('/user/:id', (req, res) => getUserController.handle(req, res))
router.get('/login', (req, res) => loginUserController.handle(req, res))
router.post('/user', (req, res) => createUserController.handle(req, res))
router.patch('/user/:id', (req, res) => updateUserController.handle(req, res))
router.delete('/user/:id', (req, res) => deleteUserController.handle(req, res))

export { router }