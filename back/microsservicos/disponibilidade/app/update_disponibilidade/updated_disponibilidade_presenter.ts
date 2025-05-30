import { Environments } from "../../shared/environments";
import { UpdateDisponibilidadeController } from "./update_disponibilidade_controller";
import { UpdateDisponibilidadeUsecase } from "./update_disponibilidade_usecase";

const repo = Environments.instance.repo
export const updateDisponibilidadeUsecase = new UpdateDisponibilidadeUsecase(repo)
export const updateDisponibilidadeController = new UpdateDisponibilidadeController(updateDisponibilidadeUsecase)