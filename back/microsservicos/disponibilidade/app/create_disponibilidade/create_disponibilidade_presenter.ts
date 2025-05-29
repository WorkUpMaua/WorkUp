import { Environments } from "../../shared/environments";
import { CreateDisponibilidadeController } from "./create_disponibilidade_controller";
import { CreateDisponibilidadeUsecase } from "./create_disponibilidade_usecase";

const repo = Environments.instance.repo
const usecase = new CreateDisponibilidadeUsecase(repo)
export const createDisponibilidadeController = new CreateDisponibilidadeController(usecase)