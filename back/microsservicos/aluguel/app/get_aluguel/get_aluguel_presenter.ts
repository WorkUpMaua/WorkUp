import { Environments } from "../../environments";
import { GetAluguelController } from "./get_aluguel_controller";
import { GetAluguelUsecase } from "./get_aluguel_usecase";

const repo = Environments.instance.repoAluguel
const usecase = new GetAluguelUsecase(repo)
export const getAluguelController = new GetAluguelController(usecase)