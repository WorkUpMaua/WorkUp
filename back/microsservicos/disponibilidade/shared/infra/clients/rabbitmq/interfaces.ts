import { CatalogoEventNames, DisponibilidadeEventNames, UserEventNames } from "./enums";
import { BookingsType, catalogo, userInformation } from "./types";

export interface BaseEvent {
  eventType: string
  payload: any
}

export interface CatalogoEvent extends BaseEvent {
  eventType: CatalogoEventNames
  payload: {userID: string} & catalogo
}

export interface UserEvent extends BaseEvent {
  eventType: UserEventNames
  payload: userInformation
}

export interface DisponibilidadeEvent extends BaseEvent {
  eventType: DisponibilidadeEventNames,
  payload: {
    aluguel: BookingsType,
    availableSpots?: number
  }
}
