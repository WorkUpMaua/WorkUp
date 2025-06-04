import { PropertyRelation } from '../../shared/interfaces';
import { getAllPropertyRelationsProps } from '../../shared/types';

interface PropertyRepository {
  findAllRelations(filters?: getAllPropertyRelationsProps): Promise<PropertyRelation[]>;
}

export class GetAllPropertyRelationsUseCase {
  constructor(private propertyRepository: PropertyRepository) {}

  async execute(filters?: getAllPropertyRelationsProps): Promise<PropertyRelation[]> {
    const relations = await this.propertyRepository.findAllRelations(filters);
    return relations;
  }
} 