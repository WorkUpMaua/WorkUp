import { PropertyRelation } from '../../shared/interfaces';
import { deletePropertyRelationProps, deletePropertyRelationReturnType } from '../../shared/types';

interface PropertyRepository {
  deleteRelation(id: string): Promise<void>;
  findByIdRelation(id: string): Promise<PropertyRelation | null>;
}

export class DeletePropertyRelationUseCase {
  constructor(private propertyRepository: PropertyRepository) {}

  async execute(id: string): Promise<deletePropertyRelationReturnType> {
    if (!id) {
      throw new Error('ID da relação é obrigatório');
    }

    const relation = await this.propertyRepository.findByIdRelation(id);
    if (!relation) {
      throw new Error('Relação não encontrada');
    }

    await this.propertyRepository.deleteRelation(id);
    return {
      id,
      deleted: true
    };
  }
} 