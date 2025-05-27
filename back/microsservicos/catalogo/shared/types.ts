import { Catalogo } from "./interfaces";

// Deixa id obrigatoria e o resto opcional
export type updateCatalogoProps = Pick<Catalogo, 'id'> & Partial<Omit<Catalogo, 'id'>>