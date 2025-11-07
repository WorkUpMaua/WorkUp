
import {
  BookingsType,
  createBookingProps,
  createDisponibilidadeProps,
  DeleteBookingProps,
  getAllDisponibilidadeProps,
  getDisponbilidadeProps,
  updateBookingProps,
  updateDisponibilidadeProps,
} from '../../domain/types';
import { UnifiedCatalogo } from '../interfaces';

export type baseDisponibilidadeType = {
  [key: string]: UnifiedCatalogo;
};

export interface DisponibilidadeRepository {
  getAllDisponibilidade(props?: getAllDisponibilidadeProps): baseDisponibilidadeType;

  getDisponibilidade(props: getDisponbilidadeProps): number;

  createDisponibilidade(props: createDisponibilidadeProps): UnifiedCatalogo;

  updateDisponibilidade(props: updateDisponibilidadeProps): UnifiedCatalogo;

  deleteDisponibilidade(id: string): UnifiedCatalogo;

  createBooking(props: createBookingProps): BookingsType;

  updateBooking(props: updateBookingProps): BookingsType;

  deleteBooking(props: DeleteBookingProps): BookingsType;
}
