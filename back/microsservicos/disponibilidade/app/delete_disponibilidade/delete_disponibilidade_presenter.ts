import { Environments } from "../../shared/environments";
import { DeleteDisponibilidadeController } from "./delete_disponibilidade_controller";
import { DeleteDisponibilidadeUsecase } from "./delete_disponibilidade_usecase";

const repo = Environments.instance.repo
const usecase = new DeleteDisponibilidadeUsecase(repo)
export const deleteDisponibilidadeController = new DeleteDisponibilidadeController(usecase)