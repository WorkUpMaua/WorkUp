import { CatalogoType } from '../../domain/types';
import { PropertyManagement } from '../interfaces';

export type basePropertyType = {
  [key: string]: PropertyManagement;
};

export interface PropertyRepository {
  getAllProperty(userID: string): PropertyManagement;

  getProperty(userID: string, catalogID: string): CatalogoType;

  createPropertyManagement(userID: string): PropertyManagement;

  createProperty(userID: string, catalog: CatalogoType): PropertyManagement;

  deleteProperty(userID: string, catalogID: string): PropertyManagement;
}
