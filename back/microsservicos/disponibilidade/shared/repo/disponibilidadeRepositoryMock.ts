import { UnifiedCatalogo } from "../interfaces";
import { BookingsType, getAllDisponibilidadeType } from "../types";

type baseDisponibilidadeType = {
  [key: string]: UnifiedCatalogo;
};

export class DisponibilidadeRepositoryMock {
  private baseDisponibilidade: baseDisponibilidadeType = {};

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
}
