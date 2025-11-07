import { Environments } from "../../shared/environments";
import { CreatePropertyUsecase } from "./create_property_usecase";

const repo = Environments.getPropertyRepo();
export const createPropertyUsecase = new CreatePropertyUsecase(repo)