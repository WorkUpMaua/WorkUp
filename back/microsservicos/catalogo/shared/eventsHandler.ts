import { userInformation } from "common/types";
import { BaseEvent } from "common/interfaces";
import { consumeEvents } from "common";

type EventType = keyof typeof eventsFunctions;

const eventsFunctions = {
  UserDeleted: async (userInfo: userInformation) => {
    console.log("Evento Recebido! ->  " + JSON.stringify(userInfo));
  },
};

export async function eventHandler(event: BaseEvent) {
  try {
    const { eventType, payload } = event;
    eventsFunctions[eventType as EventType](payload);
  } catch (err) {
    console.log(err)
  }
}

export const startQueue = async () => {
  try {
    await consumeEvents("catalogo_queue", "#.updated", eventHandler);
    await consumeEvents("catalogo_queue", "#.deleted", eventHandler);
  } catch (err) {
    console.error("Couldn't start the service queues");
    process.exit(1);
  }
};
