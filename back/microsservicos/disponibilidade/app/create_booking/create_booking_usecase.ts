import { createBookingProps } from "../../shared/domain/types";
import { DisponibilidadeRepository } from "../../shared/domain/repo/disponibilidadeRepository";

export class CreateBookingUsecase {

    constructor(private repo: DisponibilidadeRepository) {}

    public execute(props: createBookingProps) {

        const new_booking = this.repo.createBooking(props)

        return new_booking

    }

}