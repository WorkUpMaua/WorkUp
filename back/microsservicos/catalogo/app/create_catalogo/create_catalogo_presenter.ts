import { Environments } from "../../environments";
import { CreateCatalogoController } from "./create_catalogo_controller";
import { CreateCatalogoUsecase } from "./create_catalogo_usecase";

const repo = Environments.instance.repo
const usecase = new CreateCatalogoUsecase(repo)
export const createCatalogoController = new CreateCatalogoController(usecase)


