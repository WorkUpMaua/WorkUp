import { Environments } from "../../shared/environments";
import { UpdateCatalogoController } from "./update_catalogo_controller";
import { UpdateCatalogoUsecase } from "./update_catalogo_usecase";

const repo = Environments.getCatalogoRepo();
export const updateCatalogoUsecase = new UpdateCatalogoUsecase(repo)
export const updateCatalogoController = new UpdateCatalogoController(updateCatalogoUsecase)