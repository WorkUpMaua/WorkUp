import { AluguelRepositoryMock } from "../../shared/repo/aluguelRepositoryMock";

export class DeleteAluguelUsecase {

    constructor(private repo: AluguelRepositoryMock) {}

    public execute(id: string) {
        
        const aluguel = this.repo.getAluguel(id);

        if (!aluguel) throw new Error('ID não encontrado');

        const deletedAluguel = this.repo.deleteAluguel(aluguel.id);

        return deletedAluguel;
    }
}