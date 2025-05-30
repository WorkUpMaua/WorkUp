import { Environments } from "../../shared/environments";
import { UpdateDisponibilidadeController } from "./update_disponibilidade_controller";
import { UpdateDisponibilidadeUsecase } from "./update_disponibilidade_usecase";

const repo = Environments.instance.repo
const usecase = new UpdateDisponibilidadeUsecase(repo)
export const updateDisponibilidadeController = new UpdateDisponibilidadeController(usecase)