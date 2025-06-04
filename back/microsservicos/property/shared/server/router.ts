import express from 'express'
import { Router } from 'express'
import { Environments } from '../environments'

import { CreatePropertyRelationController } from '../../app/create_property/create_property_relation.controller'
import { GetPropertyRelationController } from '../../app/get_property/get_property_relation.controller'
import { GetAllPropertyRelationsController } from '../../app/get_all_property/get_all_property_relations.controller'
import { DeletePropertyRelationController } from '../../app/delete_property/delete_property_relation.controller'


import { CreatePropertyRelationUseCase } from '../../app/create_property/create_property_relation.usecase'
import { GetPropertyRelationUseCase } from '../../app/get_property/get_property_relation.usecase'
import { GetAllPropertyRelationsUseCase } from '../../app/get_all_property/get_all_property_relations.usecase'
import { DeletePropertyRelationUseCase } from '../../app/delete_property/delete_property_relation.usecase'


import { CreatePropertyRelationPresenter } from '../../app/create_property/create_property_relation.presenter'
import { GetPropertyRelationPresenter } from '../../app/get_property/get_property_relation.presenter'
import { GetAllPropertyRelationsPresenter } from '../../app/get_all_property/get_all_property_relations.presenter'
import { DeletePropertyRelationPresenter } from '../../app/delete_property/delete_property_relation.presenter'


const router = Router()


const createPropertyRelationPresenter = new CreatePropertyRelationPresenter()
const getPropertyRelationPresenter = new GetPropertyRelationPresenter()
const getAllPropertyRelationsPresenter = new GetAllPropertyRelationsPresenter()
const deletePropertyRelationPresenter = new DeletePropertyRelationPresenter()



const createPropertyRelationUseCase = new CreatePropertyRelationUseCase(Environments.instance.repo)
const getPropertyRelationUseCase = new GetPropertyRelationUseCase(Environments.instance.repo)
const getAllPropertyRelationsUseCase = new GetAllPropertyRelationsUseCase(Environments.instance.repo)
const deletePropertyRelationUseCase = new DeletePropertyRelationUseCase(Environments.instance.repo)



const createPropertyRelationController = new CreatePropertyRelationController(
  createPropertyRelationUseCase,
  createPropertyRelationPresenter
)
const getPropertyRelationController = new GetPropertyRelationController(
  getPropertyRelationUseCase,
  getPropertyRelationPresenter
)
const getAllPropertyRelationsController = new GetAllPropertyRelationsController(
  getAllPropertyRelationsUseCase,
  getAllPropertyRelationsPresenter
)
const deletePropertyRelationController = new DeletePropertyRelationController(
  deletePropertyRelationUseCase,
  deletePropertyRelationPresenter
)



export { router }
