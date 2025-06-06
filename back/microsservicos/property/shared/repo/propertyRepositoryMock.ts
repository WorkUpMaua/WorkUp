import { PropertyManagement } from '../interfaces';
import { CatalogoType } from '../types';

type basePropertyType = {
  [key: string]: PropertyManagement
}

export class PropertyRepositoryMock {
  
  private baseProperty: basePropertyType = {
    userTesd: {
      userID: "userTest",
      properties: {
        propertyTest: {
          id: "propertyTest",
          name: "A propriedade de teste",
          description: "",
          address: "Meu endereço de teste",
          comodities: [ 'Ola', 'Tudo bem ?'],
          pictures: [ 'caminho até a foto 1', 'caminho até a foto 2'],
          price: 12,
          capacity: 50
        }
      }
    }
  };

  public getAllProperty(userID: string): PropertyManagement {
    
    

    const userProperties = this.baseProperty[userID]

    if(!userProperties) throw new Error('Usuário não foi encontrado')

    return userProperties

  } 

  public getProperty(userID: string, catalogID: string): CatalogoType {

    const user = this.baseProperty[userID]

    if(!user) throw new Error('Usuário não foi encontrado')

    const catalog = user.properties[catalogID]

    if(!catalog) throw new Error('Não foi encontrado o catálogo para esse usuário')

    return catalog

  }

  public createPropertyManagement(userID: string): PropertyManagement {

    if(this.baseProperty[userID]) throw new Error('Usuário já existente na base de propriedades')

    const propertyManagement: PropertyManagement = {
      userID,
      properties: {}
    }

    this.baseProperty[userID] = propertyManagement

    return propertyManagement

  }

  public createProperty(userID: string, catalog: CatalogoType): PropertyManagement {

    const userProperties = this.baseProperty[userID]

    if(!userProperties) throw new Error('Usuário não foi encontrado')

    if(userProperties.properties[catalog.id]) throw new Error('A propriedade já existe nesse usuário')

    userProperties.properties[catalog.id] = catalog

    return userProperties

  }

} 