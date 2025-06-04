import { Request, Response } from 'express';
import { DeletePropertyRelationUseCase } from './delete_property_relation.usecase';
import { DeletePropertyRelationPresenter } from './delete_property_relation.presenter';
import { deletePropertyRelationProps } from '../../shared/types';

export class DeletePropertyRelationController {
  constructor(
    private deletePropertyRelationUseCase: DeletePropertyRelationUseCase,
    private deletePropertyRelationPresenter: DeletePropertyRelationPresenter
  ) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const relationData: deletePropertyRelationProps = {
        id: request.params.id
      };
      
      const result = await this.deletePropertyRelationUseCase.execute(relationData.id);
      return response.status(200).json(this.deletePropertyRelationPresenter.present(relationData.id));
    } catch (error) {
      return response.status(400).json({
        message: error instanceof Error ? error.message : 'Erro inesperado ao deletar relação'
      });
    }
  }
} 