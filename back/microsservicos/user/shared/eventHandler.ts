import { userInformation } from "common/types";
import { BaseEvent } from "common/interfaces";
import { consumeEvents } from "common";

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

export const startQueue = async () => {
    try {
        await consumeEvents('user_queue', 'oq.updated', eventHandler)
        // await consumeEvents('catalogo_queue', '#.deleted', eventHandler)
    } catch (err) {
        console.error('Couldn\'t start the service queues')
        process.exit(1)
    }
}
