import { updateBookingProps } from "../../shared/domain/types";
import { DisponibilidadeRepository } from "../../shared/domain/repo/disponibilidadeRepository";

export class UpdateBookingUsecase {

    constructor(private repo: DisponibilidadeRepository) {}

    public execute(props: updateBookingProps) {

        const updated_booking = this.repo.updateBooking(props)

        return updated_booking

    } 

}