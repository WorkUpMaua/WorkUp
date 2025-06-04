import { Environments } from "../../environments";
import { UpdateAluguelController } from "./update_aluguel_controller";
import { UpdateAluguelUsecase } from "./update_aluguel_usecase";

const repo = Environments.instance.repoAluguel
const usecase = new UpdateAluguelUsecase(repo)
export const updateAluguelController = new UpdateAluguelController(usecase)