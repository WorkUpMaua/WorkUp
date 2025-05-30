import { DisponibilidadeRepositoryMock } from "../../shared/repo/disponibilidadeRepositoryMock";
import { createBookingProps } from "../../shared/types";

export class CreateBookingUsecase {

    constructor(private repo: DisponibilidadeRepositoryMock) {}

    public execute(props: createBookingProps) {

        const new_booking = this.repo.createBooking(props)

        return new_booking

    }

}