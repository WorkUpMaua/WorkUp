import { Environments } from "../../environments";
import { GetAllAluguelController } from "./get_all_aluguel_controller";
import { GetAllAluguelUsecase } from "./get_all_aluguel_usecase";

const repo = Environments.instance.repoAluguel
const usecase = new GetAllAluguelUsecase(repo)
export const getAllAluguelController = new GetAllAluguelController(usecase)