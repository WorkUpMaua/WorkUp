
import { createDisponibilidadeUsecase } from "../../../app/create_disponibilidade/create_disponibilidade_presenter";
import { updateDisponibilidadeUsecase } from "../../../app/update_disponibilidade/update_disponibilidade_presenter";
import { deleteDisponibilidadeUsecase } from "../../../app/delete_disponibilidade/delete_disponibilidade_presenter";
import { AluguelEventNames, CatalogoEventNames, DisponibilidadeEventNames } from "../../infra/clients/rabbitmq/enums";
import { catalogo } from "../../infra/clients/rabbitmq/types";
import { BaseEvent, DisponibilidadeEvent } from "../../infra/clients/rabbitmq/interfaces";
import { consumeEvents, publishEvent } from "../../infra/clients/rabbitmq/rabbitmq";
import { BookingsType } from "../../domain/types";
import { getDisponibilidadeUsecase } from "../../../app/get_disponibilidade/get_disponibilidade_presenter";
import { CreateBookingUsecase } from "../../../app/create_booking/create_booking_usecase";
import { Environments } from "../../environments";
import { DeleteBookingUsecase } from "../../../app/delete_booking/delete_booking_usecase";

const eventsFunctions: { [event in CatalogoEventNames | AluguelEventNames]: (payload: any) => void }  = {

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
    },
    AluguelCreated: async (payload) => {
        const booking: BookingsType = {
            bookingID: payload['id'],
            userID: payload['userId'],
            workSpaceID: payload['workspaceId'],
            startTime: payload['startDate'],
            endTime: payload['endDate'],
            people: payload['people'],
            finalPrice: payload['finalPrice'],
            status: payload['status'],
            createdAt: payload['createdAt'],
            updatedAt: payload['updatedAt']
        }
        const id = booking.workSpaceID;
        const startTime = booking.startTime;
        const endTime = booking.endTime;
        const disponibilidade = getDisponibilidadeUsecase.execute({
            id,
            startTime,
            endTime
        });
        const disponibilidadeCheckedEvent: DisponibilidadeEvent = {
        eventType: DisponibilidadeEventNames.AvaiabilityChecked,
        payload: {
          aluguel: payload,
          availableSpots: disponibilidade
        },
      };
      await publishEvent(
        "avaiability.checked",
        disponibilidadeCheckedEvent
      );
    },
    AluguelConfirmed: async (payload) => {

        const booking: BookingsType = {
            bookingID: payload['id'],
            userID: payload['userId'],
            workSpaceID: payload['workspaceId'],
            startTime: payload['startDate'],
            endTime: payload['endDate'],
            people: payload['people'],
            finalPrice: payload['finalPrice'],
            status: payload['status'],
            createdAt: payload['createdAt'],
            updatedAt: payload['updatedAt']
        }
        const id = booking.workSpaceID;

        new CreateBookingUsecase(Environments.getDisponibilidadeRepo()).execute({
            id,
            ...booking
        });
    },
    AluguelExpired: async (payload) => {

        const booking: BookingsType = {
            bookingID: payload['id'],
            userID: payload['userId'],
            workSpaceID: payload['workspaceId'],
            startTime: payload['startDate'],
            endTime: payload['endDate'],
            people: payload['people'],
            finalPrice: payload['finalPrice'],
            status: payload['status'],
            createdAt: payload['createdAt'],
            updatedAt: payload['updatedAt']
        }

        const id = booking.workSpaceID;
        const bookingID = booking.bookingID;
        new DeleteBookingUsecase(Environments.getDisponibilidadeRepo()).execute({
            id,
            bookingID
        });
        const disponibilidadeFree: DisponibilidadeEvent = {
            eventType: DisponibilidadeEventNames.AvaiabilityFree,
            payload: {
                aluguel: booking
            },
        };
        await publishEvent(
            "avaiability.free",
            disponibilidadeFree
      );
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
        await consumeEvents("avaiability_queue", "aluguel.*", eventHandler)
    } catch(err){
        console.error("Couldn't start the service queues");
        process.exit(1);
    }

}