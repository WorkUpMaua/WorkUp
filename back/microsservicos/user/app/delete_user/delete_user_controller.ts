import axios from "axios";
import { DeleteUserUsecase } from "./delete_user_usecase";
import { Request, Response } from "express";
import { UserEvent } from "common/interfaces";
import { UserEventNames } from "common/enums";
import { publishEvent } from "common";

export class DeleteUserController {
  constructor(private usecase: DeleteUserUsecase) {}

  public async handle(req: Request, res: Response): Promise<void>{
    try {
      const { id } = req.params;

      if (!id) throw new Error("Missing user id");

      const user_deleted = this.usecase.execute(id);

      const userDeletedEvent: UserEvent = {
        eventType: UserEventNames.UserDeleted,
        payload: user_deleted
      }

      // // manda para o barramento

      // axios
      //   .post("http://localhost:10001/events", {
      //     type: "UserDeleted",
      //     payload: user_deleted,
      //   })
      //   .then()
      //   .catch((err) => console.log(err))
      //   .finally(() =>
      //     res.json({
      //       user_deleted,
      //       message: "The user was deleted",
      //     })
      //   );

      const published = await publishEvent("user.deleted", userDeletedEvent)

      if(published) {
        res.json({
          user: user_deleted,
          message: 'The user was deleted'
        })
      } else {
        throw new Error('Could not publish the event: ' + JSON.stringify(userDeletedEvent))
      }

    } catch (err) {
      res.status(500).json({
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
