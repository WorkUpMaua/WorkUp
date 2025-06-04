import { Request, Response } from 'express';
import { GetPropertyRelationUseCase } from './get_property_relation.usecase';
import { GetPropertyRelationPresenter } from './get_property_relation.presenter';
import { getPropertyRelationProps } from '../../shared/types';

export class GetPropertyRelationController {
  constructor(
    private getPropertyRelationUseCase: GetPropertyRelationUseCase,
    private getPropertyRelationPresenter: GetPropertyRelationPresenter
  ) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const relationData: getPropertyRelationProps = {
        id: request.params.id
      };
      
      const result = await this.getPropertyRelationUseCase.execute(relationData.id);
      return response.status(200).json(this.getPropertyRelationPresenter.present(result));
    } catch (error) {
      return response.status(400).json({
        message: error instanceof Error ? error.message : 'Erro inesperado ao buscar relação'
      });
    }
  }
} 