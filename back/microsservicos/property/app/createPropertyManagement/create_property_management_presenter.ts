import { Environments } from "../../shared/environments";
import { CreatePropertyManagementUsecase } from "./create_property_management_usecase";

const repo = Environments.getPropertyRepo();
export const createPropertyManagementUsecase = new CreatePropertyManagementUsecase(repo)