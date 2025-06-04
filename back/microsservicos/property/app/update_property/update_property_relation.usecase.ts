import { PropertyRelation } from '../../shared/interfaces';

interface PropertyRepository {
  findByIdRelation(id: string): Promise<PropertyRelation | null>;
  updateRelation(id: string, data: Partial<PropertyRelation>): Promise<PropertyRelation>;
}

export class UpdatePropertyRelationUseCase {
  constructor(private propertyRepository: PropertyRepository) {}

  async execute(id: string, data: Partial<PropertyRelation>): Promise<PropertyRelation> {
    if (!id) {
      throw new Error('ID da relação é obrigatório');
    }

    const existingRelation = await this.propertyRepository.findByIdRelation(id);
    if (!existingRelation) {
      throw new Error('Relação não encontrada');
    }

    const updatedRelation = await this.propertyRepository.updateRelation(id, data);
    return updatedRelation;
  }
} 