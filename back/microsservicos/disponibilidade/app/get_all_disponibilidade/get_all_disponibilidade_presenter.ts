import { Environments } from "../../shared/environments";
import { GetAllDisponibilidadeController } from "./get_all_disponibilidade_controller";
import { GetAllDisponibilidadeUsecase } from "./get_all_disponibilidade_usecase";

const repo = Environments.instance.repo
const usecase = new GetAllDisponibilidadeUsecase(repo)
export const getAllDisponibilidadeController = new GetAllDisponibilidadeController(usecase)