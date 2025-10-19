import { Environments } from "../../shared/environments";
import { GetCatalogoController } from "./get_catalogo_controller";
import { GetCatalogoUsecase } from "./get_catalogo_usecase";

const repo = Environments.getCatalogoRepo();
const usecase = new GetCatalogoUsecase(repo)
export const getCatalogoController = new GetCatalogoController(usecase)