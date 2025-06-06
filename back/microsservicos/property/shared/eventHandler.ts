import { consumeEvents } from "common";
import { BaseEvent } from "common/interfaces";

/**
 * @todo: terminar a implementacao da comunicacao entre esse mss e o user_mss e o catalog_mss
 */

export async function eventHandler(event: BaseEvent) {
    try {
        const { eventType, payload } = event
        
    } catch(err) {
        console.log(err)
    }
}

export const startQueue = async () => {

    try {
        await consumeEvents("property_queue", "user.*", eventHandler)
    } catch(err){
        console.error("Couldn't start the service queues");
        process.exit(1);
    }

}