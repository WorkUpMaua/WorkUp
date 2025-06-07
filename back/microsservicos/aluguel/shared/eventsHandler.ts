import { aluguel } from "common/types";
import { AluguelEventNames } from "common/enums";
import { BaseEvent } from "common/interfaces";
import { consumeEvents } from "common";
import { createAluguelUsecase } from "../app/create_aluguel/create_aluguel_presenter";
import { updateAluguelUsecase } from "../app/update_aluguel/update_aluguel_presenter";
import { deleteAluguelUsecase } from "../app/delete_aluguel/delete_aluguel_presenter";

const eventsFunctions: { [event in AluguelEventNames]: (payload: any) => void }  = {

    AluguelCreated: async (aluguelInfo: aluguel) => {
        const created_catalogo = createAluguelUsecase.execute(aluguelInfo)
        console.log(created_catalogo)
    },
    AluguelUpdated: async (aluguelInfo: aluguel) => {
        const updated_catalogo = updateAluguelUsecase.execute(aluguelInfo)
        console.log(updated_catalogo)
    },
    AluguelDeleted: async (aluguelInfo: aluguel) => {
        const deleted_catalogo = deleteAluguelUsecase.execute(aluguelInfo.id)
        console.log(deleted_catalogo)
    }

}

export async function eventHandler(event: BaseEvent) {
  try {
    const { eventType, payload } = event;
    eventsFunctions[eventType as AluguelEventNames](payload);
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
