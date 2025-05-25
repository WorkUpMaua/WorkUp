import { Environments } from "../../environments";
import { GetAllUserController } from "./get_all_user_controller";
import { GetAllUserUsecase } from "./get_all_user_usecase";

const repo = Environments.instance.repo
const usecase = new GetAllUserUsecase(repo)
export const getAllUserController = new GetAllUserController(usecase)