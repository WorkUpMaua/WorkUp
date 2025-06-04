import { PropertyRelation } from '../../shared/interfaces';
import { createPropertyRelationProps } from '../../shared/types';

interface PropertyRepository {
  createRelation(data: createPropertyRelationProps): Promise<PropertyRelation>;
}

export class CreatePropertyRelationUseCase {
  constructor(private propertyRepository: PropertyRepository) {}

  async execute(data: createPropertyRelationProps): Promise<PropertyRelation> {
    if (!data.userId || !data.catalogId) {
      throw new Error('UserId e CatalogId são obrigatórios');
    }

    const relation = await this.propertyRepository.createRelation(data);
    return relation;
  }
} 