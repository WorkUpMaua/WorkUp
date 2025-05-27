import { userInformation } from "common/types";
import { BaseEvent } from "common/interfaces";

type EventType = keyof typeof eventsFunctions

const eventsFunctions = {

    UserDeleted: async (userInfo: userInformation) => {

        console.log('Evento Recebido! ->  ' + JSON.stringify(userInfo))

    } 

}

export async function eventHandler(event: BaseEvent) {

    const { eventType, payload } = event
    eventsFunctions[eventType as EventType](payload)

}