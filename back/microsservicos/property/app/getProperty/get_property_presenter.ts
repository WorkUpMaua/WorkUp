import { Environments } from "../../shared/environments";
import { GetPropertyController } from "./get_property_controller";
import { GetPropertyUsecase } from "./get_property_usecase";

const repo = Environments.getPropertyRepo();
const usecase = new GetPropertyUsecase(repo)
export const getPropertyController = new GetPropertyController(usecase)