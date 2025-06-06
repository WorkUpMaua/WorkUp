import { Environments } from "../../shared/environments";
import { DeleteAluguelController } from "./delete_aluguel_controller";
import { DeleteAluguelUsecase } from "./delete_aluguel_usecase";

const repo = Environments.instance.repoAluguel
export const deleteAluguelUsecase = new DeleteAluguelUsecase(repo)
export const deleteAluguelController = new DeleteAluguelController(deleteAluguelUsecase)