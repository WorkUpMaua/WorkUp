import { GetAllPropertyUsecase } from "./get_all_property_usecase";
import { GetAllPropertyController } from "./get_all_property_controller";
import { Environments } from "../../shared/environments";


const repo = Environments.instance.repo
const usecase = new GetAllPropertyUsecase(repo)
export const getAllPropertyController = new GetAllPropertyController(usecase)