import { Request, Response } from 'express';
import { UpdatePropertyRelationUseCase } from './update_property_relation.usecase';
import { UpdatePropertyRelationPresenter } from './update_property_relation.presenter';
import { PropertyRelation } from '../../shared/interfaces';

export class UpdatePropertyRelationController {
  constructor(
    private updatePropertyRelationUseCase: UpdatePropertyRelationUseCase,
    private updatePropertyRelationPresenter: UpdatePropertyRelationPresenter
  ) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const id = request.params.id;
      const updateData: Partial<PropertyRelation> = {
        userId: request.body.userId,
        catalogId: request.body.catalogId
      };

      const result = await this.updatePropertyRelationUseCase.execute(id, updateData);
      return response.status(200).json(this.updatePropertyRelationPresenter.present(result));
    } catch (error) {
      return response.status(400).json({
        message: error instanceof Error ? error.message : 'Erro inesperado ao atualizar relação'
      });
    }
  }
} 