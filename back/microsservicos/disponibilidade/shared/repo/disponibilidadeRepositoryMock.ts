import { v4 as uuidv4 } from "uuid";
import { UnifiedCatalogo } from "../interfaces";
import { BookingsType, createDisponibilidadeProps, getAllDisponibilidadeType } from "../types";

type baseDisponibilidadeType = {
  [key: string]: UnifiedCatalogo;
};

export class DisponibilidadeRepositoryMock {
  private baseDisponibilidade: baseDisponibilidadeType = {
    "idUnico": {
      id: "idUnico",
      name: "nome",
      address: 'São Paulo',
      comodities: [ "A", "B"],
      pictures: [ "C", "D" ],
      price: 20,
      capacity: 1,
      confirmedBookings: [
        {
          // Dia 28, das 10 ate as 18
          bookingID: "idUnico da reserva",
          userID: 'idUnico do usuario',
          startTime: 1748437200,
          endTime: 1748466000
        },
        {
          // Dia 29, das 10, ate as 18
          bookingID: "idUnico da reserva",
          userID: 'idUnico do usuario',
          startTime: 1748523600,
          endTime: 1748552400
        }
      ]
    }
  };

  public getAllDisponibilidade(props?: getAllDisponibilidadeType): baseDisponibilidadeType {
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
    return filteredCatalogos.reduce( (acc, catalog) => {
        acc[catalog.id] = catalog
        return acc
    }, {} as baseDisponibilidadeType)

  }

  public createDisponibilidade(props: createDisponibilidadeProps): UnifiedCatalogo {

    const id = uuidv4()

    const new_catalog_disponibilidade: UnifiedCatalogo = {
      id,
      name: props.name,
      address: props.address,
      comodities: props.comodities,
      pictures: props.pictures,
      price: props.price,
      capacity: props.capacity,
      confirmedBookings: []
    } 

    this.baseDisponibilidade[id] = new_catalog_disponibilidade

    return new_catalog_disponibilidade

  }
}
