import { Environments } from "../../environments";
import { DeleteUserController } from "./delete_user_controller";
import { DeleteUserUsecase } from "./delete_user_usecase";

const repo = Environments.instance.repo
const usecase = new DeleteUserUsecase(repo)
export const deleteUserController = new DeleteUserController(usecase)