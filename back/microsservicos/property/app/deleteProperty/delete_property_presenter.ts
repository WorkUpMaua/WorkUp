import { Environments } from "../../shared/environments";
import { DeletePropertyUsecase } from "./delete_property_usecase";

const repo = Environments.getPropertyRepo();
export const deletePropertyUsecase = new DeletePropertyUsecase(repo);
