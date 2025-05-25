import axios from "axios";
import { updateUserPropsType } from "../../shared/types/Routes";
import { UpdateUserUsecase } from "./update_user_usecase";
import { Request, Response } from "express";

export class UpdateUserController {
  constructor(private usecase: UpdateUserUsecase) {}

  public handle(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const body = req.body;

      if(!id) throw new Error('Missing user ID')

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
        message: 'The user was updated'
      }))


    } catch (err) {
      res.status(500).json({
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
