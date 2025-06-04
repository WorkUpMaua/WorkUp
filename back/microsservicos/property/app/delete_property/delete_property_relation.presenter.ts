import { deletePropertyRelationReturnType } from '../../shared/types';

export class DeletePropertyRelationPresenter {
  present(id: string): deletePropertyRelationReturnType {
    return {
      id,
      deleted: true
    };
  }
} 