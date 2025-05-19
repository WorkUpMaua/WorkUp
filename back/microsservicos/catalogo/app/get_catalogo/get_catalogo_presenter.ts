import { Environments } from "../../environments";
import { GetCatalogoController } from "./get_catalogo_controller";
import { GetCatalogoUsecase } from "./get_catalogo_usecase";

const repo = Environments.instance.repo
const usecase = new GetCatalogoUsecase(repo)
export const getCatalogoController = new GetCatalogoController(usecase)