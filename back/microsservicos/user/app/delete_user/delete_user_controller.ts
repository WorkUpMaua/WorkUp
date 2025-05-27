import axios from "axios";
import { DeleteUserUsecase } from "./delete_user_usecase";
import { Request, Response } from "express";

export class DeleteUserController {
  constructor(private usecase: DeleteUserUsecase) {}

  public handle(req: Request, res: Response): void{
    try {
      const { id } = req.params;

      if (!id) throw new Error("Missing user id");

      const user_deleted = this.usecase.execute(id);

      // manda para o barramento

      axios
        .post("http://localhost:10001/events", {
          type: "UserDeleted",
          payload: user_deleted,
        })
        .then()
        .catch((err) => console.log(err))
        .finally(() =>
          res.json({
            user_deleted,
            message: "The user was deleted",
          })
        );
    } catch (err) {
      res.status(500).json({
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
