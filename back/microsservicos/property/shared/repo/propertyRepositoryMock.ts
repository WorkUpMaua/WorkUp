import { PropertyRelation } from '../interfaces';
import { createPropertyRelationProps } from '../types';

export class PropertyRepositoryMock {
  private relations: PropertyRelation[] = [];

  async findByIdRelation(id: string): Promise<PropertyRelation | null> {
    const relation = this.relations.find(r => r.id === id);
    return relation || null;
  }

  async findAllRelations(filters?: { userId?: string; catalogId?: string }): Promise<PropertyRelation[]> {
    let filtered = this.relations;
    
    if (filters?.userId) {
      filtered = filtered.filter(r => r.userId === filters.userId);
    }
    
    if (filters?.catalogId) {
      filtered = filtered.filter(r => r.catalogId === filters.catalogId);
    }
    
    return filtered;
  }

  async createRelation(data: createPropertyRelationProps): Promise<PropertyRelation> {
    const newRelation: PropertyRelation = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.relations.push(newRelation);
    return newRelation;
  }

  async updateRelation(id: string, data: Partial<PropertyRelation>): Promise<PropertyRelation> {
    const index = this.relations.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Relação não encontrada');
    }

    const updatedRelation = {
      ...this.relations[index],
      ...data,
      updatedAt: new Date()
    };

    this.relations[index] = updatedRelation;
    return updatedRelation;
  }

  async deleteRelation(id: string): Promise<void> {
    const index = this.relations.findIndex(r => r.id === id);
    if (index !== -1) {
      this.relations.splice(index, 1);
    }
  }
} 