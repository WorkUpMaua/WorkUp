import { CatalogoEvents, UserEvents } from "./enums";
import { catalogo, userInformation } from "./types";

export interface BaseEvent {
  eventType: string
  payload: any
}

export interface CatalogoCreatedEvent extends BaseEvent {
  eventType: CatalogoEvents
  payload: catalogo
}

export interface CatalogoUpdatedEvent extends BaseEvent {
  eventType: CatalogoEvents
  payload: catalogo
}

export interface CatalogoDeletedEvent extends BaseEvent {
  eventType: CatalogoEvents
  payload: catalogo
}

export interface UserCreatedEvent extends BaseEvent {
  eventType: UserEvents
  payload: userInformation
}

export interface UserUpdatedEvent extends BaseEvent {
  eventType: UserEvents
  payload: userInformation
}

export interface UserDeletedEvent extends BaseEvent {
  eventType: UserEvents
  payload: userInformation
}