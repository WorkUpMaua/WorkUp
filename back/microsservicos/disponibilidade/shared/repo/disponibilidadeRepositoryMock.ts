import { UnifiedCatalogo } from "../interfaces";
import {
  BookingsType,
  createBookingProps,
  createDisponibilidadeProps,
  DeleteBookingProps,
  getAllDisponibilidadeProps,
  getDisponbilidadeProps,
  updateBookingProps,
  updateDisponibilidadeProps,
} from "../types";

type baseDisponibilidadeType = {
  [key: string]: UnifiedCatalogo;
};

export class DisponibilidadeRepositoryMock {
  private baseDisponibilidade: baseDisponibilidadeType = {};

  public getAllDisponibilidade(
  props?: getAllDisponibilidadeProps
): baseDisponibilidadeType {
  if (!props) {
    return this.baseDisponibilidade;
  }

  const useDateFilter = props.startTime != null && props.endTime != null;

  const filtrados: UnifiedCatalogo[] = Object.values(this.baseDisponibilidade).filter(
    catalog => {

      if (useDateFilter) {
        const overlaps = catalog.confirmedBookings.filter(b =>
          props.endTime! > b.startTime && props.startTime! < b.endTime
        ).length;
        if (overlaps >= catalog.capacity) {
          return false;
        }
      }

      if (props.minPrice != null && catalog.price < props.minPrice) {
        return false;
      }
      if (props.maxPrice != null && catalog.price > props.maxPrice) {
        return false;
      }

      if (props.capacity != null && catalog.capacity < props.capacity) {
        return false;
      }

      return true;
    }
  );

  const resultado: baseDisponibilidadeType = {};
  for (const cat of filtrados) {
    resultado[cat.id] = cat;
  }

  return resultado;
}


  public getDisponibilidade(props: getDisponbilidadeProps): number {
  const { id, startTime, endTime } = props;

  if (!this.baseDisponibilidade[id]) {
    throw new Error("Sala não encontrada na base consolidada");
  }

  const catalog = this.baseDisponibilidade[id];

  const overlappings = catalog.confirmedBookings.filter((booking) =>
    booking.startTime < endTime && booking.endTime > startTime
  ).length;

  const disponivel = catalog.capacity - overlappings;
  return disponivel < 0 ? 0 : disponivel;
}

  public createDisponibilidade(
    props: createDisponibilidadeProps
  ): UnifiedCatalogo {
    const new_catalog_disponibilidade: UnifiedCatalogo = {
      id: props.id,
      name: props.name,
      address: props.address,
      comodities: props.comodities,
      pictures: props.pictures,
      price: props.price,
      capacity: props.capacity,
      confirmedBookings: [],
    };

    this.baseDisponibilidade[props.id] = new_catalog_disponibilidade;

    return new_catalog_disponibilidade;
  }

  public updateDisponibilidade(
    props: updateDisponibilidadeProps
  ): UnifiedCatalogo {
    const { id, name, address, comodities, pictures, price, capacity } = props;

    if (!this.baseDisponibilidade[id])
      throw new Error("Sala não encontrada na base consolidada");

    const disponibilidade_to_update = this.baseDisponibilidade[id];

    if (name) disponibilidade_to_update.name = name;
    if (address) disponibilidade_to_update.address = address;
    if (comodities) disponibilidade_to_update.comodities = comodities;
    if (pictures) disponibilidade_to_update.pictures = pictures;
    if (price) disponibilidade_to_update.price = price;
    if (capacity) disponibilidade_to_update.capacity = capacity;

    return disponibilidade_to_update;
  }

  public deleteDisponibilidade(id: string): UnifiedCatalogo {
    if (!this.baseDisponibilidade[id])
      throw new Error("Sala não encontrada na base consolidada");

    const disponibilidade_to_delete = this.baseDisponibilidade[id];

    delete this.baseDisponibilidade[id];

    return disponibilidade_to_delete;
  }

  public createBooking(props: createBookingProps): BookingsType {
    const { id, catalogID, bookingID, userID, startTime, endTime } = props;

    if (!this.baseDisponibilidade[id])
      throw new Error("Sala não encontrada na base consolidada");

    const catalog = this.baseDisponibilidade[id];

    const booking: BookingsType = {
      catalogID,
      bookingID,
      userID,
      startTime,
      endTime,
    };

    catalog.confirmedBookings.push(booking);

    return booking;
  }

  public updateBooking(props: updateBookingProps): BookingsType {
    const { id, catalogID, bookingID, userID, startTime, endTime } = props;

    if (!this.baseDisponibilidade[id])
      throw new Error("Sala não encontrada na base consolidada");

    const catalogo = this.baseDisponibilidade[id];

    const bookingToUpdateIndex = catalogo.confirmedBookings.findIndex(
      (booking) => booking.bookingID === bookingID
    );

    if (catalogID)
      catalogo.confirmedBookings[bookingToUpdateIndex].catalogID = catalogID;
    if (userID)
      catalogo.confirmedBookings[bookingToUpdateIndex].userID = userID;
    if (startTime)
      catalogo.confirmedBookings[bookingToUpdateIndex].startTime = startTime;
    if (endTime)
      catalogo.confirmedBookings[bookingToUpdateIndex].endTime = endTime;

    return catalogo.confirmedBookings[bookingToUpdateIndex];
  }

  public deleteBooking(props: DeleteBookingProps): BookingsType {
    const { id, bookingID } = props;

    if (!this.baseDisponibilidade[id])
      throw new Error("Sala não encontrada na base consolidada");

    const catalogo = this.baseDisponibilidade[id];

    const booking_to_delete_index = catalogo.confirmedBookings.findIndex(
      (booking) => booking.bookingID === bookingID
    );

    const booking_to_delete = catalogo.confirmedBookings.splice(booking_to_delete_index, 1)

    return booking_to_delete[0]
      
  }
}
