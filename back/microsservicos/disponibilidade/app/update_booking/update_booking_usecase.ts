import { DisponibilidadeRepositoryMock } from "../../shared/repo/disponibilidadeRepositoryMock";
import { updateBookingProps } from "../../shared/types";

export class UpdateBookingUsecase {

    constructor(private repo: DisponibilidadeRepositoryMock) {}

    public execute(props: updateBookingProps) {

        const updated_booking = this.repo.updateBooking(props)

        return updated_booking

    } 

}