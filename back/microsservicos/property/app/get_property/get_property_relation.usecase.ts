import { PropertyRelation } from '../../shared/interfaces';
import { getPropertyRelationProps } from '../../shared/types';

interface PropertyRepository {
  findByIdRelation(id: string): Promise<PropertyRelation | null>;
}

export class GetPropertyRelationUseCase {
  constructor(private propertyRepository: PropertyRepository) {}

  async execute(id: string): Promise<PropertyRelation> {
    if (!id) {
      throw new Error('ID da relação é obrigatório');
    }

    const relation = await this.propertyRepository.findByIdRelation(id);
    if (!relation) {
      throw new Error('Relação não encontrada');
    }

    return relation;
  }
} 