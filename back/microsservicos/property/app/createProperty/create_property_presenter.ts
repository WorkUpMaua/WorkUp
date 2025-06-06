import { Environments } from "../../shared/environments";
import { CreatePropertyUsecase } from "./create_property_usecase";

const repo = Environments.instance.repo
export const createPropertyUsecase = new CreatePropertyUsecase(repo)