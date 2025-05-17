import { Environments } from "../../environments";
import { GetAllCatalogoController } from "./get_all_catalogo_controller";
import { GetAllCatalogoUsecase } from "./get_all_catalogo_usecase";

const repo = Environments.instance.repo
const usecase = new GetAllCatalogoUsecase(repo)
export const getAllCatalogoController = new GetAllCatalogoController(usecase)