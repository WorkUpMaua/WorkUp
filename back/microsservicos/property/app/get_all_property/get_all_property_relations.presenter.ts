import { PropertyRelation } from '../../shared/interfaces';

export class GetAllPropertyRelationsPresenter {
  present(data: PropertyRelation[]): PropertyRelation[] {
    return data.map(relation => ({
      id: relation.id,
      userId: relation.userId,
      catalogId: relation.catalogId,
      createdAt: relation.createdAt,
      updatedAt: relation.updatedAt
    }));
  }
} 