import { catalogo } from "common/types";
import { CatalogoEventNames } from "common/enums";
import { BaseEvent } from "common/interfaces";
import { consumeEvents } from "common";
import { createDisponibilidadeUsecase } from "../app/create_disponibilidade/create_disponibilidade_presenter";
import { updateDisponibilidadeUsecase } from "../app/update_disponibilidade/updated_disponibilidade_presenter";
import { deleteDisponibilidadeUsecase } from "../app/delete_disponibilidade/delete_disponibilidade_presenter";

const eventsFunctions: { [event in CatalogoEventNames]: (payload: any) => void }  = {

    CatalogoCreated: async (catalogoInfo: catalogo) => {
        const created_catalogo = createDisponibilidadeUsecase.execute(catalogoInfo)
        console.log(created_catalogo)
    },
    CatalogoUpdated: async (catalogoInfo: catalogo) => {
        const updated_catalogo = updateDisponibilidadeUsecase.execute(catalogoInfo)
        console.log(updated_catalogo)
    },
    CatalogoDeleted: async (catalogoInfo: catalogo) => {
        const deleted_catalogo = deleteDisponibilidadeUsecase.execute(catalogoInfo.id)
        console.log(deleted_catalogo)
    }

}

export async function eventHandler(event: BaseEvent) {
    try {
        const{ eventType, payload } = event
        eventsFunctions[eventType as CatalogoEventNames](payload)
    } catch(err){
        console.log(err)
    }
}

export const startQueue = async () => {

    try {
        await consumeEvents("avaiability_queue", "catalogo.*", eventHandler)
    } catch(err){
        console.error("Couldn't start the service queues");
        process.exit(1);
    }

}