import axios from "axios";

import { UpdateUserUsecase } from "./update_user_usecase";
import { Request, Response } from "express";
import { updateUserPropsType } from "../../shared/types";

export class UpdateUserController {
  constructor(private usecase: UpdateUserUsecase) {}

  public handle(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const body = req.body;

      if(!id) throw new Error('ID do usuário não informado');

      const props: updateUserPropsType = {
        id,
        name: body.name as string,
        cpf: body.cpf as string,
        birth: body.birth as number,
        phone: body.phone as string
      }

      const updatedUser = this.usecase.execute(props)

      // manda para o barramento de eventos
      axios.post('http://localhost:10001/events', {
        type: 'UserUpdated',
        payload: updatedUser
      })
      .then()
      .catch( (err) => console.log(err) )
      .finally(() => res.json({
        updatedUser,
        message: 'O usuário foi atualizado com sucesso'
      }))


    } catch (err) {
      res.status(500).json({
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
