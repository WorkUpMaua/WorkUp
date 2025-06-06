import { consumeEvents } from "common";
import { CatalogoEventNames, UserEventNames } from "common/enums";
import { BaseEvent } from "common/interfaces";
import { catalogo, userInformation } from "common/types";
import { createPropertyManagementUsecase } from "../app/createPropertyManagement/create_property_management_presenter";
import { createPropertyUsecase } from "../app/createProperty/create_property_presenter";

type EventType = keyof typeof eventsFunctions;

const eventsFunctions: { [event in UserEventNames.UserCreated | CatalogoEventNames.CatalogoCreated] : (payload: any) => void } = {

    UserCreated: async (userInfo: userInformation) => {
        const created_user = createPropertyManagementUsecase.execute(userInfo.id)
        console.log(created_user)
    },
    CatalogoCreated: async (catalogoInfo: catalogo) => {

        const { userID, ...catalog } = catalogoInfo 

        const created_catalogo = createPropertyUsecase.execute(userID, catalog)

        console.log(created_catalogo)
    }

}

export async function eventHandler(event: BaseEvent) {
    try {
        const { eventType, payload } = event
        eventsFunctions[eventType as EventType](payload);
    } catch(err) {
        console.log(err)
    }
}

export const startQueue = async () => {

    try {
        await consumeEvents("property_queue", "user.created", eventHandler)
        await consumeEvents("property_queue", "catalogo.created", eventHandler)
    } catch(err){
        console.error("Couldn't start the service queues");
        process.exit(1);
    }

}