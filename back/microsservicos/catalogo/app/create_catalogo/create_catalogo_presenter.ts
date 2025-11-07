import { Environments } from "../../shared/environments";
import { CreateCatalogoController } from "./create_catalogo_controller";
import { CreateCatalogoUsecase } from "./create_catalogo_usecase";

const repo = Environments.getCatalogoRepo();
const usecase = new CreateCatalogoUsecase(repo)
export const createCatalogoController = new CreateCatalogoController(usecase)


