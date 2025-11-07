import { AluguelRepositoryMock } from "../../shared/repo/aluguelRepositoryMock";

export class GetAluguelUsecase {

    constructor(private repo: AluguelRepositoryMock) {}

    public exectute(id: string) {
        
        const room = this.repo.getAluguel(id)

        if(!room) throw new Error('ID não encontrado')

        return room

    }

}