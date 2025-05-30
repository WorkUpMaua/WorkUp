import { Environments } from "../../shared/environments";
import { UpdateUserController } from "./update_user_controller";
import { UpdateUserUsecase } from "./update_user_usecase";

const repo = Environments.instance.repo
const usecase = new UpdateUserUsecase(repo)
export const updateUserController = new UpdateUserController(usecase)