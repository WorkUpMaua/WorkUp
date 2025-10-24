import { Environments } from "../../shared/environments";
import { DeleteCatalogoController } from "./delete_catalogo_controller";
import { DeleteCatalogoUsecase } from "./delete_catalogo_usecase";

const repo = Environments.getCatalogoRepo();
const usecase = new DeleteCatalogoUsecase(repo)
export const deleteCatalogoController = new DeleteCatalogoController(usecase)