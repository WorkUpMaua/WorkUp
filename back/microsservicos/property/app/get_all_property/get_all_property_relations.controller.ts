import { Request, Response } from 'express';
import { GetAllPropertyRelationsUseCase } from './get_all_property_relations.usecase';
import { GetAllPropertyRelationsPresenter } from './get_all_property_relations.presenter';
import { getAllPropertyRelationsProps } from '../../shared/types';

export class GetAllPropertyRelationsController {
  constructor(
    private getAllPropertyRelationsUseCase: GetAllPropertyRelationsUseCase,
    private getAllPropertyRelationsPresenter: GetAllPropertyRelationsPresenter
  ) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const filters: getAllPropertyRelationsProps = {
        userId: request.query.userId as string,
        catalogId: request.query.catalogId as string
      };
      
      const result = await this.getAllPropertyRelationsUseCase.execute(filters);
      return response.status(200).json(this.getAllPropertyRelationsPresenter.present(result));
    } catch (error) {
      return response.status(400).json({
        message: error instanceof Error ? error.message : 'Erro inesperado ao buscar relações'
      });
    }
  }
} 