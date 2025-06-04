import { Request, Response } from 'express';
import { CreatePropertyRelationUseCase } from './create_property_relation.usecase';
import { CreatePropertyRelationPresenter } from './create_property_relation.presenter';
import { createPropertyRelationProps } from '../../shared/types';

export class CreatePropertyRelationController {
  constructor(
    private createPropertyRelationUseCase: CreatePropertyRelationUseCase,
    private createPropertyRelationPresenter: CreatePropertyRelationPresenter
  ) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const propertyData: createPropertyRelationProps = {
        userId: request.body.userId,
        catalogId: request.body.catalogId
      };

      const result = await this.createPropertyRelationUseCase.execute(propertyData);
      return response.status(201).json(this.createPropertyRelationPresenter.present(result));
    } catch (error) {
      return response.status(400).json({
        message: error instanceof Error ? error.message : 'Erro inesperado ao criar relação'
      });
    }
  }
} 