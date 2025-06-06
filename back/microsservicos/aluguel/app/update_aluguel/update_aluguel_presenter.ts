import { Environments } from "../../shared/environments";
import { UpdateAluguelController } from "./update_aluguel_controller";
import { UpdateAluguelUsecase } from "./update_aluguel_usecase";

const repo = Environments.instance.repoAluguel
export const updateAluguelUsecase = new UpdateAluguelUsecase(repo)
export const updateAluguelController = new UpdateAluguelController(updateAluguelUsecase)