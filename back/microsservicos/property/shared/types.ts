import { PropertyRelation } from './interfaces';

export type getPropertyRelationProps = Pick<PropertyRelation, 'id'>;

export type getAllPropertyRelationsProps = {
  userId?: string;
  catalogId?: string;
};

export type createPropertyRelationProps = Omit<PropertyRelation, 'id' | 'createdAt' | 'updatedAt'>;

export type deletePropertyRelationProps = Pick<PropertyRelation, 'id'>;

export type deletePropertyRelationReturnType = {
  id: string;
  deleted: boolean;
}; 