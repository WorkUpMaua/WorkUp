import { AluguelRepositoryMock } from "../../shared/repo/aluguelRepositoryMock";
import { updateAluguelProps } from "../../shared/types"

export class UpdateAluguelUsecase {

    constructor(private repo: AluguelRepositoryMock) {}

    public execute(props: updateAluguelProps) {

        const Aluguel = this.repo.getAluguel(props.id)

        if (!Aluguel) throw new Error('ID não encontrado')

        const room_updated = this.repo.updateAluguel(props)

        return room_updated

    }

}