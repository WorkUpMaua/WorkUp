import { Environments } from "../../shared/environments";
import { GetAllDisponibilidadeController } from "../get_all_disponibilidade/get_all_disponibilidade_controller";
import { GetDisponibilidadeController } from "./get_disponibilidade_controller";
import { GetDisponibilidadeUsecase } from "./get_disponibilidade_usecase";

const repo = Environments.instance.repo
const usecase = new GetDisponibilidadeUsecase(repo)
export const getDisponibilidade = new GetDisponibilidadeController(usecase)