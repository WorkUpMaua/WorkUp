import { PropertyRelation } from '../../shared/interfaces';

export class UpdatePropertyRelationPresenter {
  present(data: PropertyRelation): PropertyRelation {
    return {
      id: data.id,
      userId: data.userId,
      catalogId: data.catalogId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  }
} 