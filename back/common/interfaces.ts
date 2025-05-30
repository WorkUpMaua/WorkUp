import { CatalogoEventNames, UserEventNames } from "./enums";
import { catalogo, userInformation } from "./types";

export interface BaseEvent {
  eventType: string
  payload: any
}

export interface CatalogoEvent extends BaseEvent {
  eventType: CatalogoEventNames
  payload: catalogo
}

export interface UserEvent extends BaseEvent {
  eventType: UserEventNames
  payload: userInformation
}
