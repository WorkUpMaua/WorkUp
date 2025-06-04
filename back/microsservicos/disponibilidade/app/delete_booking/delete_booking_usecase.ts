import { DisponibilidadeRepositoryMock } from "../../shared/repo/disponibilidadeRepositoryMock";
import { DeleteBookingProps } from "../../shared/types";

export class DeleteBookingUsecase {

    constructor(private repo: DisponibilidadeRepositoryMock) {}

    public execute(props: DeleteBookingProps) {

        const deleted_booking = this.repo.deleteBooking(props)

        return deleted_booking

    }

}