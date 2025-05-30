import { Environments } from "../../shared/environments";
import { DeleteDisponibilidadeController } from "./delete_disponibilidade_controller";
import { DeleteDisponibilidadeUsecase } from "./delete_disponibilidade_usecase";

const repo = Environments.instance.repo
export const deleteDisponibilidadeUsecase = new DeleteDisponibilidadeUsecase(repo)
export const deleteDisponibilidadeController = new DeleteDisponibilidadeController(deleteDisponibilidadeUsecase)