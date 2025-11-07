import { DeleteBookingProps } from "../../shared/domain/types";
import { DisponibilidadeRepository } from "../../shared/domain/repo/disponibilidadeRepository";

export class DeleteBookingUsecase {

    constructor(private repo: DisponibilidadeRepository) {}

    public execute(props: DeleteBookingProps) {

        const deleted_booking = this.repo.deleteBooking(props)

        return deleted_booking

    }

}