import { createPropertyUsecase } from "../../../app/createProperty/create_property_presenter";
import { createPropertyManagementUsecase } from "../../../app/createPropertyManagement/create_property_management_presenter";
import { deletePropertyUsecase } from "../../../app/deleteProperty/delete_property_presenter";
import { CatalogoEventNames, UserEventNames } from "../../infra/clients/rabbitmq/enums";
import { BaseEvent } from "../../infra/clients/rabbitmq/interfaces";
import { consumeEvents } from "../../infra/clients/rabbitmq/rabbitmq";
import { catalogo, userInformation } from "../../infra/clients/rabbitmq/types";



const eventsFunctions: Record<string, (payload: any) => Promise<void> | void> = {
    [UserEventNames.UserCreated]: async (userInfo: userInformation) => {
        const created_user = createPropertyManagementUsecase.execute(userInfo.id);
        console.log(created_user);
    },
    [CatalogoEventNames.CatalogoCreated]: async (catalogoInfo: catalogo) => {
        const { userID, ...catalog } = catalogoInfo;
        const created_catalogo = createPropertyUsecase.execute(userID, catalog);
        console.log(created_catalogo);
    },
    [CatalogoEventNames.CatalogoDeleted]: async (catalogoInfo: catalogo) => {
        const { userID, id } = catalogoInfo;
        if (!userID) {
            console.warn('catalogo.deleted recebido sem userID, ignorando');
            return;
        }
        const deleted = deletePropertyUsecase.execute(userID, id);
        console.log(deleted);
    },
};

export async function eventHandler(event: BaseEvent) {
    try {
        const handler = eventsFunctions[event.eventType];
        if (handler) {
            await handler(event.payload);
        }
    } catch (err) {
        console.log(err);
    }
}

export const startQueue = async () => {

    try {
        await consumeEvents("property_queue", "user.created", eventHandler)
        await consumeEvents("property_queue", "catalogo.*", eventHandler)
    } catch(err){
        console.error("Couldn't start the service queues");
        process.exit(1);
    }

}
