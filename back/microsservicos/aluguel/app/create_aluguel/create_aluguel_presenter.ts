import { Environments } from "../../environments";
import { CreateAluguelController } from "./create_aluguel_controller";
import { CreateAluguelUsecase } from "./create_aluguel_usecase";

const repoAluguel = Environments.instance.repoAluguel
const usecase = new CreateAluguelUsecase(repoAluguel)
export const createAluguelController = new CreateAluguelController(usecase)