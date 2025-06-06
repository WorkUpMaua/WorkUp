import { Environments } from "../../shared/environments";
import { CreatePropertyManagementUsecase } from "./create_property_management_usecase";

const repo = Environments.instance.repo
export const createPropertyManagementUsecase = new CreatePropertyManagementUsecase(repo)