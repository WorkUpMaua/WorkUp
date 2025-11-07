import { CatalogoType } from './types';

export interface Properties { [key: string]: CatalogoType }

export interface PropertyManagement {
  userID: string,
  properties: Properties
}