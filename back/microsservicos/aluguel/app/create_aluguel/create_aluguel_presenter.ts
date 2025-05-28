import { Environments } from "../../environments";
import { CreateAluguelController } from "./create_aluguel_controller";
import { CreateAluguelUsecase } from "./create_aluguel_usecase";

const repoAluguel = Environments.instance.repoAluguel
const repoUser = Environments.instance.repoUser
const repoCatalogo = Environments.instance.repoCatalogo
const usecase = new CreateAluguelUsecase(repoAluguel, repoUser, repoCatalogo)
export const createAluguelController = new CreateAluguelController(usecase)