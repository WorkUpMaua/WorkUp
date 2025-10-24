import { Catalogo } from '../interfaces';
import { updateCatalogoProps } from '../types';

export interface CatalogoRepository {
  getAllCatalogo(): { [key: string]: Catalogo };

  getCatalogo(id: string): Catalogo;

  createCatalogo(props: Catalogo): Catalogo;

  updateCatalogo(props: updateCatalogoProps): Catalogo;

  deleteCatalogo(id: string): Catalogo;
}
