import { v4 as uuidv4 } from "uuid";
import { UnifiedCatalogo } from "../interfaces";
import {
  BookingsType,
  createBookingProps,
  createDisponibilidadeProps,
  getAllDisponibilidadeProps,
  getDisponbilidadeProps,
  updateDisponibilidadeProps,
} from "../types";

type baseDisponibilidadeType = {
  [key: string]: UnifiedCatalogo;
};

export class DisponibilidadeRepositoryMock {
  private baseDisponibilidade: baseDisponibilidadeType = {
    idUnico: {
      id: "idUnico",
      name: "nome",
      address: "São Paulo",
      comodities: ["A", "B"],
      pictures: ["C", "D"],
      price: 20,
      capacity: 1,
      confirmedBookings: [
        {
          // Dia 28, das 10 ate as 18
          catalogID: "idUnico",
          bookingID: "idUnico da reserva",
          userID: "idUnico do usuario",
          startTime: 1748437200,
          endTime: 1748466000,
        },
        {
          // Dia 29, das 10, ate as 18
          catalogID: "idUnico",
          bookingID: "idUnico da reserva",
          userID: "idUnico do usuario",
          startTime: 1748523600,
          endTime: 1748552400,
        },
      ],
    },
  };

  public getAllDisponibilidade(
    props?: getAllDisponibilidadeProps
  ): baseDisponibilidadeType {
    if (!props) {
      return this.baseDisponibilidade;
    }

    const catalogos_info = this.baseDisponibilidade;

    // Filtra as salas que estao disponiveis
    const filteredCatalogos = Object.values(catalogos_info).filter(
      (catalog) => {
        const overlappings = catalog.confirmedBookings.filter(
          (b) => props.endTime > b.startTime && props.startTime < b.endTime
        ).length;
        return overlappings < catalog.capacity;
      }
    );

    // Volta para o json
    return filteredCatalogos.reduce((acc, catalog) => {
      acc[catalog.id] = catalog;
      return acc;
    }, {} as baseDisponibilidadeType);
  }

  // Pergunta quantos lugares disponiveis tem a sala
  public getDisponibilidade(props: getDisponbilidadeProps): number {
    const { id, startTime, endTime } = props;

    if (!this.baseDisponibilidade[id])
      throw new Error("Sala não encontrada na base consolidada");

    const catalog = this.baseDisponibilidade[id];

    const overlappings = catalog.confirmedBookings.filter(
      (booking) => startTime > booking.startTime && endTime < booking.endTime
    ).length;

    return catalog.capacity - overlappings < 0
      ? 0
      : catalog.capacity - overlappings;
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
    
    const { id, catalogID, bookingID, userID, startTime, endTime } = props

    if (!this.baseDisponibilidade[id])
      throw new Error("Sala não encontrada na base consolidada");

    const catalog = this.baseDisponibilidade[id]

    const booking: BookingsType = {
      catalogID,
      bookingID,
      userID,
      startTime,
      endTime
    }

    catalog.confirmedBookings.push(booking)

    return booking

  }


}
